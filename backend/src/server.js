require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");

const { services } = require("./data");
const { bookingSchema, contactMessageSchema } = require("./validation");
const { env } = require("./config/env");
const { createMailTransporter, isAuthFailure } = require("./email/transport");
const { createStripeClient } = require("./payments/stripeGateway");
const { sendPaidBookingEmails } = require("./email/bookingEmails");
const { buildContactEmailText } = require("./email/contactEmail");

const app = express();
const stripe = createStripeClient(env.stripeSecret);
const mailTransporter = createMailTransporter(env);

const bookings = [];
const contactMessages = [];
const confirmedPaymentSessions = new Set();

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

app.post("/api/bookings", (_req, res) => {
  return res.status(410).json({
    error: "Direct booking submission is disabled",
    hint: "Use /api/payments/checkout-session first, then /api/bookings/confirm-payment after successful payment."
  });
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
    // Add timeout for email sending (60 seconds max)
    const emailPromise = mailTransporter.sendMail({
      from: `TB Tours Contact <${env.smtpUser}>`,
      to: env.contactToEmail,
      replyTo: contactMessage.email,
      subject: `TB Tours Contact: ${contactMessage.name}`,
      text: buildContactEmailText(contactMessage)
    });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Email sending timeout")), 60000)
    );

    await Promise.race([emailPromise, timeoutPromise]);

    contactMessages.push({ ...contactMessage, status: "sent" });

    return res.status(201).json({
      message: "Thanks, your message has been sent.",
      contact: { id: contactMessage.id, status: "sent" }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to send email";
    const errorStack = error instanceof Error ? error.stack : "";
    
    console.error("Email sending failed:", {
      message,
      errorStack,
      errorType: error?.constructor?.name
    });

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

app.post("/api/payments/checkout-session", async (req, res) => {
  const bookingResult = bookingSchema.safeParse(req.body);
  if (!bookingResult.success) {
    return res.status(400).json({
      error: "Invalid booking payload",
      details: bookingResult.error.issues
    });
  }

  const selectedService = services.find((item) => item.id === bookingResult.data.serviceId);
  if (!selectedService) {
    return res.status(404).json({ error: "Selected service not found" });
  }

  if (!stripe) {
    return res.status(503).json({
      error: "Stripe is not configured",
      hint: "Set STRIPE_SECRET_KEY in backend/.env"
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: bookingResult.data.email,
      metadata: {
        fullName: bookingResult.data.fullName,
        email: bookingResult.data.email,
        phone: bookingResult.data.phone,
        pickupLocation: bookingResult.data.pickupLocation,
        dropoffLocation: bookingResult.data.dropoffLocation,
        travelDate: bookingResult.data.travelDate,
        passengers: String(bookingResult.data.passengers),
        serviceId: bookingResult.data.serviceId,
        serviceName: selectedService.name,
        notes: (bookingResult.data.notes || "").slice(0, 450)
      },
      line_items: [
        {
          price_data: {
            currency: env.currency,
            unit_amount: selectedService.priceZar * 100,
            product_data: {
              name: selectedService.name,
              description: `${bookingResult.data.pickupLocation} to ${bookingResult.data.dropoffLocation}`
            }
          },
          quantity: 1
        }
      ],
      success_url: `${env.clientUrl}/booking-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${env.clientUrl}/booking-cancelled`
    });

    return res.status(201).json({ url: session.url });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to create checkout session";
    return res.status(500).json({ error: message });
  }
});

const confirmPaidSessionAndNotify = async (req, res) => {
  const sessionId = typeof req.body?.sessionId === "string" ? req.body.sessionId.trim() : "";
  if (!sessionId) {
    return res.status(400).json({ error: "sessionId is required" });
  }

  if (!stripe) {
    return res.status(503).json({
      error: "Stripe is not configured",
      hint: "Set STRIPE_SECRET_KEY in backend/.env"
    });
  }

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    if (session.mode !== "payment") {
      return res.status(400).json({ error: "Invalid checkout session mode" });
    }

    if (session.payment_status !== "paid") {
      return res.status(409).json({
        error: "Payment not completed",
        paymentStatus: session.payment_status
      });
    }

    const metadata = session.metadata || {};
    const booking = {
      id: `bk_${Date.now()}`,
      createdAt: new Date().toISOString(),
      status: "paid",
      paymentSessionId: session.id,
      amountZar: Number(((session.amount_total || 0) / 100).toFixed(2)),
      fullName: metadata.fullName || session.customer_details?.name || "Customer",
      email: metadata.email || session.customer_details?.email || session.customer_email || "",
      phone: metadata.phone || "",
      serviceId: metadata.serviceId || "",
      serviceName: metadata.serviceName || "Booking Service",
      pickupLocation: metadata.pickupLocation || "",
      dropoffLocation: metadata.dropoffLocation || "",
      travelDate: metadata.travelDate || "",
      passengers: Number(metadata.passengers || 1),
      notes: metadata.notes || ""
    };

    if (!confirmedPaymentSessions.has(session.id)) {
      confirmedPaymentSessions.add(session.id);
      bookings.push(booking);
    }

    if (!mailTransporter) {
      return res.status(200).json({
        message: "Payment confirmed. Booking saved.",
        booking,
        email: {
          status: "not_configured",
          hint: "Set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS and CONTACT_TO_EMAIL in backend/.env"
        }
      });
    }

    const emailSentKey = `${session.id}:emailed`;
    const emailQueuedKey = `${session.id}:emailing`;

    if (confirmedPaymentSessions.has(emailSentKey)) {
      return res.status(200).json({
        message: "Payment confirmed.",
        booking,
        email: { status: "sent" },
        alreadyConfirmed: true
      });
    }

    if (confirmedPaymentSessions.has(emailQueuedKey)) {
      return res.status(200).json({
        message: "Payment confirmed. Email is being sent in the background.",
        booking,
        email: { status: "pending" },
        alreadyConfirmed: true
      });
    }

    confirmedPaymentSessions.add(emailQueuedKey);

    // Respond quickly after payment confirmation; email delivery continues in background.
    setImmediate(async () => {
      try {
        await sendPaidBookingEmails({
          mailTransporter,
          smtpUser: env.smtpUser,
          contactToEmail: env.contactToEmail,
          booking
        });

        confirmedPaymentSessions.add(emailSentKey);
      } catch (emailError) {
        const details = emailError instanceof Error ? emailError.message : "Unknown email error";
        console.error(`[EMAIL] Failed to send booking email for session ${session.id}: ${details}`);
      } finally {
        confirmedPaymentSessions.delete(emailQueuedKey);
      }
    });

    return res.status(200).json({
      message: "Payment confirmed. Booking notification and customer confirmation are being sent.",
      booking,
      email: { status: "pending" }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to confirm payment";

    if (message.toLowerCase().includes("no such checkout.session")) {
      return res.status(404).json({ error: "Checkout session not found", details: message });
    }

    return res.status(500).json({ error: "Failed to confirm payment", details: message });
  }
};

app.post("/api/bookings/confirm-payment", confirmPaidSessionAndNotify);
app.post("/api/payments/confirm-session", confirmPaidSessionAndNotify);

app.get("/api/bookings", (_req, res) => {
  res.json({ count: bookings.length, bookings });
});

app.get("/api/contact", (_req, res) => {
  res.json({ count: contactMessages.length, contactMessages });
});

app.listen(env.port, () => {
  console.log(`TB Tours API running on http://localhost:${env.port}`);
});
