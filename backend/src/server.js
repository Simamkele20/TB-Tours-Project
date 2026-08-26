require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { services } = require("./data");
const { contactMessageSchema } = require("./validation");
const { env } = require("./config/env");
const { createMailTransporter, isAuthFailure } = require("./email/transport");
const { buildContactEmailText } = require("./email/contactEmail");

const app = express();
const mailTransporter = createMailTransporter(env);

const contactMessages = [];

const normalizeOrigin = (value) => String(value || "").trim().replace(/\/+$/, "").toLowerCase();
const allowedOrigins = new Set(env.clientUrls.map(normalizeOrigin).filter(Boolean));
const productionFallbackOrigins = new Set([
  "https://tb-tours.co.za",
  "https://www.tb-tours.co.za"
]);

const isAllowedOrigin = (origin) => {
  const requestOrigin = normalizeOrigin(origin);
  return allowedOrigins.has(requestOrigin) || productionFallbackOrigins.has(requestOrigin);
};

app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (isAllowedOrigin(origin)) {
        return callback(null, true);
      }

      const effectiveAllowList = Array.from(new Set([...allowedOrigins, ...productionFallbackOrigins]));
      console.warn(`[CORS] Blocked origin: ${origin}. Allowed: ${effectiveAllowList.join(", ")}`);
      return callback(null, false);
    }
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("dev"));

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

  if (!mailTransporter) {
    return res.status(503).json({
      error: "Email sending is not configured",
      hint: "Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and CONTACT_TO_EMAIL in backend/.env"
    });
  }

  const contactMessage = {
    id: `ct_${Date.now()}`,
    createdAt: new Date().toISOString(),
    status: "received",
    ...result.data
  };

  try {
    await mailTransporter.sendMail({
      from: `TB Tours Contact <${env.smtpUser}>`,
      to: env.contactToEmail,
      replyTo: contactMessage.email,
      subject: `TB Tours Contact: ${contactMessage.name}`,
      text: buildContactEmailText(contactMessage)
    });

    contactMessages.push({ ...contactMessage, status: "sent" });

    return res.status(201).json({
      message: "Thanks, your message has been sent.",
      contact: { id: contactMessage.id, status: "sent" }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to send email";
    const authFailure = isAuthFailure(message);

    if (authFailure) {
      return res.status(401).json({
        error: "SMTP authentication failed",
        hint: "For Gmail, use SMTP_USER as your full Gmail address and SMTP_PASS as a 16-character Google App Password (not your normal Gmail password).",
        details: message
      });
    }

    return res.status(500).json({
      error: "Failed to send message",
      details: message
    });
  }
});

app.get("/api/contact", (_req, res) => {
  res.json({ count: contactMessages.length, contactMessages });
});

app.listen(env.port, () => {
  console.log(`TB Tours API running on http://localhost:${env.port}`);
});
