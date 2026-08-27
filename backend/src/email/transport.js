const FormData = require("form-data");
const Mailgun = require("mailgun.js");

const createMailgunClient = ({ smtpPass }) => {
  if (!smtpPass) {
    console.error("[MAILGUN] Missing API key (SMTP_PASS)");
    return null;
  }

  try {
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