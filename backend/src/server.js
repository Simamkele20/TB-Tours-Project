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
const { contactMessageSchema } = require("./validation");
const { env } = require("./config/env");
const { createMailgunClient } = require("./email/transport");
const { buildContactEmailText } = require("./email/contactEmail");

const app = express();
const mailgunClient = createMailgunClient(env);
const mailgunDomain = process.env.NODE_ENV === "production" 
  ? "tb-tours.co.za" 
  : "sandboxf1e866405b11426296207bac0d2f4cca.mailgun.org";
const contactMessages = [];

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

app.listen(env.port, () => {
  console.log(`TB Tours (Pty)Ltd API running on http://localhost:${env.port}`);
});
