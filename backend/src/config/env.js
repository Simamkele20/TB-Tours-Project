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
  mailgunApiKey: (process.env.MAILGUN_API_KEY || "").trim(),
  mailgunDomain: (process.env.MAILGUN_DOMAIN || "sandboxf1e866405b11426296207bac0d2f4cca.mailgun.org").trim(),
  contactToEmail: (process.env.CONTACT_TO_EMAIL || "info@tb-tours.co.za").trim(),
  // Database Configuration (PostgreSQL for Render, MySQL for local development)
  databaseUrl: process.env.DATABASE_URL || "",
  // MySQL Configuration (local development fallback)
  mysqlHost: (process.env.MYSQL_HOST || "localhost").trim(),
  mysqlUser: (process.env.MYSQL_USER || "root").trim(),
  mysqlPassword: (process.env.MYSQL_PASSWORD || "").trim(),
  mysqlDatabase: (process.env.MYSQL_DATABASE || "tb_tours").trim(),
  // JWT Configuration
  jwtSecret: process.env.JWT_SECRET || "your-secret-key-change-in-production",
  jwtExpiry: process.env.JWT_EXPIRY || "24h",
  verificationCodeExpiry: Number(process.env.VERIFICATION_CODE_EXPIRY || 15 * 60 * 1000),
  skipEmailVerification: String(process.env.SKIP_EMAIL_VERIFICATION || "false").toLowerCase() === "true",
  adminEmails: [],
  
  // Yoco Configuration (Active Payment Gateway)
  yocoPublicKey: process.env.YOCO_PUBLIC_KEY || "",
  yocoSecretKey: process.env.YOCO_SECRET_KEY || "",
  yocoRedirectUrl: (process.env.YOCO_REDIRECT_URL || `${clientUrls[0]}/payment-confirmation`).trim(),
  frontendUrl: process.env.FRONTEND_URL || clientUrls[0] || "http://localhost:4200",
  
  // Testing & Debug
  useMockPayment: process.env.USE_MOCK_PAYMENT === "true"
};

module.exports = { env };
