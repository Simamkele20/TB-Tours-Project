const FormData = require("form-data");
const Mailgun = require("mailgun.js");

const createMailgunClient = ({ smtpPass }) => {
  if (!smtpPass) {
    console.error("[MAILGUN] Missing API key (SMTP_PASS)");
    return null;
  }

  try {
    // For development: disable SSL certificate verification
    if (process.env.NODE_ENV !== 'production') {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
      console.log("[MAILGUN] SSL verification disabled for development");
    }

    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
      username: "api",
      key: smtpPass
    });
    console.log("[MAILGUN] Client initialized successfully");
    return mg;
  } catch (error) {
    console.error("[MAILGUN] Failed to initialize:", error.message);
    return null;
  }
};

module.exports = { createMailgunClient };