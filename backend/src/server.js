// Load environment variables from .env.develop in development
// In production, Render sets environment variables directly
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config({ path: ".env.develop" });
}

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { services } = require("./data");
const {
  contactMessageSchema,
  registerSchema,
  loginSchema,
  verifyEmailSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} = require("./validation");
const { env } = require("./config/env");
const { createMailgunClient } = require("./email/transport");
const { buildContactEmailText } = require("./email/contactEmail");
const {
  buildVerificationEmailText,
  buildVerificationEmailHtml,
  buildPasswordResetEmailText,
  buildPasswordResetEmailHtml,
} = require("./email/authEmails");
const { connectDB, sequelize } = require("./db/connect");
const User = require("./models/User");
const Tour = require("./models/Tour");
const Booking = require("./models/Booking");
const { signToken, verifyToken } = require("./auth/jwt");
const { hashPassword, comparePassword } = require("./auth/passwordHash");
const { generateVerificationCode, getCodeExpiry } = require("./auth/codeGenerator");
const { authMiddleware } = require("./middleware/authMiddleware");
const adminRouter = require("./routes/admin");
const bookingRouter = require("./routes/bookings");

const app = express();
const mailgunClient = createMailgunClient(env);
const mailgunDomain = env.mailgunDomain;
const contactMessages = [];

if (!mailgunClient) {
  console.warn("[STARTUP] Email service not configured. Set SMTP_PASS environment variable to enable emails.");
}

const normalizeOrigin = (value) => String(value || "").trim().replace(/\/+$/, "").toLowerCase();
const allowedOrigins = new Set(env.clientUrls.map(normalizeOrigin).filter(Boolean));
const productionFallbackOrigins = new Set([
  "https://tb-tours.co.za",
  "https://www.tb-tours.co.za"
]);

const isAllowedOrigin = (origin) => {
  const requestOrigin = normalizeOrigin(origin);
  // Allow localhost in development
  if (requestOrigin.includes('localhost') || requestOrigin.includes('127.0.0.1')) {
    return true;
  }
  return allowedOrigins.has(requestOrigin) || productionFallbackOrigins.has(requestOrigin);
};

app.use(helmet());
app.use(
  cors({
    origin: function(origin, callback) {
      // Allow requests with no origin (like mobile apps or server requests)
      if (!origin) return callback(null, true);
      
      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      const effectiveAllowList = Array.from(new Set([...allowedOrigins, ...productionFallbackOrigins]));
      console.warn(`[CORS] Blocked origin: ${origin}. Allowed: ${effectiveAllowList.join(", ")}`);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

app.get("/", (_req, res) => {
  res.status(200).send("TB Tours (Pty)Ltd API is running");
});

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", service: "tb-tours-api" });
});

app.get("/api/services", (_req, res) => {
  res.json({ services });
});

app.post("/api/contact", async (req, res) => {
  const result = contactMessageSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: "Invalid contact payload",
      details: result.error.issues
    });
  }

  if (!mailgunClient) {
    return res.status(503).json({
      error: "Email sending is not configured",
      hint: "Set SMTP_PASS (Mailgun API key) in backend/.env"
    });
  }

  const contactMessage = {
    id: `ct_${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "received",
    ...result.data
  };

  try {
    await mailgunClient.messages.create(mailgunDomain, {
      from: "TB Tours (Pty)Ltd <noreply@tb-tours.co.za>",
      to: [env.contactToEmail],
      replyTo: contactMessage.email,
      subject: `TB Tours (Pty)Ltd Contact: ${contactMessage.name}`,
      text: buildContactEmailText(contactMessage)
    });

    contactMessages.push({ ...contactMessage, status: "sent" });

    return res.status(201).json({
      message: "Thanks, your message has been sent.",
      contact: { id: contactMessage.id, status: "sent" }
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    const errorStatus = error?.status || error?.statusCode || 500;
    console.error("[EMAIL ERROR]", errorMessage);
    console.error("[EMAIL ERROR DETAILS]", error);
    return res.status(errorStatus).json({
      error: "Failed to send message",
      details: errorMessage,
      hint: "Sandbox domains only allow sending to authorized recipients. Add your email to Mailgun > Domain Settings > Authorized Recipients"
    });
  }
});

app.get("/api/contact", (_req, res) => {
  res.json({ count: contactMessages.length, contactMessages });
});

// ============================================
// AUTHENTICATION ENDPOINTS
// ============================================

/**
 * POST /api/auth/register
 * Register a new user
 */
app.post("/api/auth/register", async (req, res) => {
  try {
    const result = registerSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Validation error",
        details: result.error.issues,
      });
    }

    const { firstName, lastName, email, password } = result.data;
    const normalizedEmail = email.toLowerCase();

    // Check if user already exists (case-insensitive)
    const existingUser = await User.findOne({ 
      where: sequelize.where(sequelize.fn('LOWER', sequelize.col('email')), sequelize.fn('LOWER', normalizedEmail))
    });
    if (existingUser) {
      // If email is unverified, delete it and allow re-registration
      if (!existingUser.verified) {
        await existingUser.destroy();
        console.log(`[AUTH] Deleted unverified account for ${normalizedEmail}, allowing re-registration`);
      } else {
        // Email is verified, cannot register again
        return res.status(409).json({ error: "Email already registered" });
      }
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Generate verification code
    const verificationCode = generateVerificationCode();
    const verificationCodeExpiry = getCodeExpiry(15);

    // Determine if user is admin based on specific email
    let role = "customer";
    if (normalizedEmail === "princetancu06@gmail.com") {
      role = "admin";
    }

    // ALL users require email verification before login
    const verified = false;

    // Create user (with normalized email)
    const user = await User.create({
      firstName,
      lastName,
      email: normalizedEmail,
      passwordHash,
      verificationCode: verificationCode,
      verificationCodeExpiry: verificationCodeExpiry,
      role,
      verified: verified,
    });

    // Send verification email if mailgun is configured
    if (mailgunClient) {
      try {
        await mailgunClient.messages.create(mailgunDomain, {
          from: "TB Tours (Pty)Ltd <noreply@tb-tours.co.za>",
          to: [normalizedEmail],
          subject: "Verify your TB Tours account",
          text: buildVerificationEmailText(normalizedEmail, verificationCode),
          html: buildVerificationEmailHtml(normalizedEmail, verificationCode),
        });
        console.log(`[EMAIL SENT] Verification code sent to ${normalizedEmail}`);
      } catch (emailError) {
        console.error("[EMAIL ERROR] Failed to send verification email:", emailError.message);
        if (emailError.message.includes("Recipient validation failed")) {
          console.log("[TIP] For Mailgun sandbox: Add your email to Authorized Recipients in Domain Settings");
        }
        console.log(`[DEBUG] Verification code for testing: ${verificationCode}`);
      }
    } else {
      console.log(`[DEBUG] Verification code for testing: ${verificationCode}`);
    }

    const message = "Registration successful. Please check your email to verify your account.";

    return res.status(201).json({
      message,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("[REGISTER ERROR]", error);
    return res.status(500).json({ error: "Registration failed" });
  }
});

/**
 * POST /api/auth/verify-email
 * Verify email with code
 */
app.post("/api/auth/verify-email", async (req, res) => {
  try {
    const result = verifyEmailSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Validation error",
        details: result.error.issues,
      });
    }

    const { email, code } = result.data;
    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ 
      where: sequelize.where(sequelize.fn('LOWER', sequelize.col('email')), sequelize.fn('LOWER', normalizedEmail))
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.verified) {
      return res.status(400).json({ error: "Email already verified" });
    }

    // Check verification code
    if (user.verificationCode !== code) {
      return res.status(400).json({ error: "Invalid verification code" });
    }

    // Check if code expired
    if (new Date() > user.verificationCodeExpiry) {
      return res.status(400).json({ error: "Verification code expired" });
    }

    // Mark user as verified
    await user.update({
      verified: true,
      verificationCode: null,
      verificationCodeExpiry: null,
    });

    return res.json({
      message: "Email verified successfully. You can now log in.",
      user: {
        id: user.id,
        email: user.email,
        verified: user.verified,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("[VERIFY EMAIL ERROR]", error);
    return res.status(500).json({ error: "Verification failed" });
  }
});

/**
 * POST /api/auth/login
 * Login with email and password
 */
app.post("/api/auth/login", async (req, res) => {
  try {
    console.log("[LOGIN] Request received:", req.body.email);
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Validation error",
        details: result.error.issues,
      });
    }

    const { email, password } = result.data;
    const normalizedEmail = email.toLowerCase();
    console.log("[LOGIN] Validated email:", normalizedEmail);

    const user = await User.findOne({ 
      where: sequelize.where(sequelize.fn('LOWER', sequelize.col('email')), sequelize.fn('LOWER', normalizedEmail))
    });
    console.log("[LOGIN] User found:", !!user);
    if (!user) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Check if email is verified
    console.log("[LOGIN] User verified:", user.verified);
    if (!user.verified) {
      return res.status(403).json({
        error: "Email not verified",
        message: "Please verify your email before logging in",
      });
    }

    // Compare password
    console.log("[LOGIN] Checking password...");
    console.log("[LOGIN] Stored hash:", user.passwordHash.substring(0, 20) + "...");
    const passwordMatch = await comparePassword(password, user.passwordHash);
    console.log("[LOGIN] Password match result:", passwordMatch);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Invalid email or password" });
    }

    // Generate JWT token
    const token = signToken(user, env.jwtSecret, env.jwtExpiry);

    return res.json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        verified: user.verified,
      },
    });
  } catch (error) {
    console.error("[LOGIN ERROR]", error.message);
    console.error("[LOGIN ERROR] Full error:", error);
    return res.status(500).json({ error: "Login failed", details: error.message });
  }
});

/**
 * POST /api/auth/forgot-password
 * Request password reset code
 */
app.post("/api/auth/forgot-password", async (req, res) => {
  try {
    const result = forgotPasswordSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Validation error",
        details: result.error.issues,
      });
    }

    const { email } = result.data;
    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ 
      where: sequelize.where(sequelize.fn('LOWER', sequelize.col('email')), sequelize.fn('LOWER', normalizedEmail))
    });
    if (!user) {
      // Return success even if user doesn't exist (security best practice)
      return res.json({
        message: "If the email exists, a password reset code has been sent.",
      });
    }

    // Generate reset code
    const resetCode = generateVerificationCode();
    const resetCodeExpiry = getCodeExpiry(15);

    await user.update({
      resetCode: resetCode,
      resetCodeExpiry: resetCodeExpiry,
    });

    // Send reset email
    if (mailgunClient) {
      try {
        await mailgunClient.messages.create(mailgunDomain, {
          from: "TB Tours (Pty)Ltd <noreply@tb-tours.co.za>",
          to: [normalizedEmail],
          subject: "Reset your TB Tours password",
          text: buildPasswordResetEmailText(normalizedEmail, resetCode),
          html: buildPasswordResetEmailHtml(normalizedEmail, resetCode),
        });
        console.log(`[EMAIL SENT] Password reset code sent to ${normalizedEmail}`);
      } catch (emailError) {
        console.error("[EMAIL ERROR] Failed to send password reset email:", emailError.message);
        console.log(`[DEBUG] Password reset code for testing: ${resetCode}`);
      }
    } else {
      console.log(`[DEBUG] Password reset code for testing: ${resetCode}`);
    }

    return res.json({
      message: "If the email exists, a password reset code has been sent.",
      debug: env.nodeEnv === "development" ? { resetCode } : undefined
    });
  } catch (error) {
    console.error("[FORGOT PASSWORD ERROR]", error);
    return res.status(500).json({ error: "Password reset request failed" });
  }
});

/**
 * POST /api/auth/reset-password
 * Reset password with code
 */
app.post("/api/auth/reset-password", async (req, res) => {
  try {
    const result = resetPasswordSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({
        error: "Validation error",
        details: result.error.issues,
      });
    }

    const { email, code, newPassword } = result.data;
    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ 
      where: sequelize.where(sequelize.fn('LOWER', sequelize.col('email')), sequelize.fn('LOWER', normalizedEmail))
    });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check reset code
    if (user.resetCode !== code) {
      return res.status(400).json({ error: "Invalid reset code" });
    }

    // Check if code expired
    if (new Date() > user.resetCodeExpiry) {
      return res.status(400).json({ error: "Reset code expired" });
    }

    // Update password
    const passwordHash = await hashPassword(newPassword);
    console.log("[RESET PASSWORD] New password hash:", passwordHash.substring(0, 20) + "...");
    await user.update({
      passwordHash: passwordHash,
      resetCode: null,
      resetCodeExpiry: null,
    });
    console.log("[RESET PASSWORD] User updated successfully");

    return res.json({
      message: "Password reset successful. You can now log in with your new password.",
      user: {
        id: user.id,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("[RESET PASSWORD ERROR]", error);
    return res.status(500).json({ error: "Password reset failed" });
  }
});

/**
 * GET /api/auth/me
 * Get current user (protected route)
 */
app.get("/api/auth/me", authMiddleware(env.jwtSecret), async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    return res.json({
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        verified: user.verified,
      },
    });
  } catch (error) {
    console.error("[GET USER ERROR]", error);
    return res.status(500).json({ error: "Failed to fetch user" });
  }
});

// ============================================
// ADMIN ROUTES
// ============================================
app.use("/api/admin", adminRouter);

// BOOKING ROUTES
// ============================================
app.use("/api", bookingRouter);

// ============================================
// SERVER INITIALIZATION
// ============================================

const startServer = async () => {
  try {
    // Connect to MySQL
    await connectDB();

    app.listen(env.port, () => {
      console.log(`TB Tours (Pty)Ltd API running on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("[STARTUP ERROR]", error);
    process.exit(1);
  }
};

startServer();
