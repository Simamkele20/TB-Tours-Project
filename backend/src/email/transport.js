const nodemailer = require("nodemailer");

const createMailTransporter = ({ smtpHost, smtpPort, smtpUser, smtpPass, smtpSecure }) => {
  if (!smtpHost || !smtpUser || !smtpPass) {
    return null;
  }

  return nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: smtpSecure,
    auth: {
      user: smtpUser,
      pass: smtpPass
    }
  });
};

const isAuthFailure = (message) => /535|badcredentials|username and password not accepted/i.test(message);

module.exports = { createMailTransporter, isAuthFailure };
