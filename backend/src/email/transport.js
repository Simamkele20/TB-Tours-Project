const nodemailer = require("nodemailer");
const dns = require("node:dns");

dns.setDefaultResultOrder("ipv4first");

const createMailTransporter = ({ smtpHost, smtpPort, smtpUser, smtpPass, smtpSecure }) => {
  console.log("Creating mail transporter with:", {
    smtpHost,
    smtpPort,
    smtpUser: smtpUser ? `${smtpUser.substring(0, 5)}...` : "undefined",
    smtpPass: smtpPass ? "***" : "undefined",
    smtpSecure
  });

  if (!smtpHost || !smtpUser || !smtpPass) {
    console.error("Missing SMTP configuration:", { smtpHost: !!smtpHost, smtpUser: !!smtpUser, smtpPass: !!smtpPass });
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    family: 4,
    connectionTimeout: 30000,
    greetingTimeout: 30000,
    socketTimeout: 30000,
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });
};

const isAuthFailure = (message) => /535|badcredentials|username and password not accepted/i.test(message);

module.exports = { createMailTransporter, isAuthFailure };
