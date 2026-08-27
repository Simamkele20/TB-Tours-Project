const nodemailer = require("nodemailer");
const dns = require("node:dns");

dns.setDefaultResultOrder("ipv4first");

const createMailTransporter = ({ smtpHost, smtpPort, smtpUser, smtpPass, smtpSecure }) => {
  if (!smtpHost || !smtpUser || !smtpPass) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
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
