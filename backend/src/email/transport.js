const FormData = require("form-data");
const Mailgun = require("mailgun.js");

const createMailgunClient = ({ mailgunApiKey }) => {
  if (!mailgunApiKey) {
    console.error("[MAILGUN] Missing API key (MAILGUN_API_KEY)");
    return null;
  }

  try {
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
      username: "api",
      key: mailgunApiKey
    });
    console.log("[MAILGUN] Client initialized successfully with production domain");
    return mg;
  } catch (error) {
    console.error("[MAILGUN] Failed to initialize:", error.message);
    return null;
  }
};

module.exports = { createMailgunClient };