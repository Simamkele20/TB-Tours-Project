const rawClientUrls = process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:4200";
const clientUrls = rawClientUrls
  .split(/[\s,]+/)
  .map((url) => url.trim())
  .filter(Boolean);

const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: clientUrls[0] || "http://localhost:4200",
  clientUrls,
  smtpHost: (process.env.SMTP_HOST || "").trim(),
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpUser: (process.env.SMTP_USER || "").trim(),
  smtpPass: (process.env.SMTP_PASS || "").replace(/\s+/g, ""),
  smtpSecure: String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",
  mailgunDomain: (process.env.MAILGUN_DOMAIN || "sandboxf1e866405b11426296207bac0d2f4cca.mailgun.org").trim(),
  contactToEmail: (process.env.CONTACT_TO_EMAIL || "info@tb-tours.co.za").trim(),
  // MySQL Configuration
  mysqlHost: (process.env.MYSQL_HOST || "localhost").trim(),
  mysqlUser: (process.env.MYSQL_USER || "root").trim(),
  mysqlPassword: (process.env.MYSQL_PASSWORD || "").trim(),
  mysqlDatabase: (process.env.MYSQL_DATABASE || "tb_tours").trim(),
  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
  jwtExpiry: process.env.JWT_EXPIRY || "24h",
  verificationCodeExpiry: Number(process.env.VERIFICATION_CODE_EXPIRY || 15 * 60 * 1000),
  skipEmailVerification: String(process.env.SKIP_EMAIL_VERIFICATION || "false").toLowerCase() === "true",
  adminEmails: []
};

module.exports = { env };
