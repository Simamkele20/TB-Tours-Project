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
  adminEmails: [],
  // Paystack Configuration
  paystackSecretKey: process.env.PAYSTACK_SECRET_KEY || "",
  paystackPublicKey: process.env.PAYSTACK_PUBLIC_KEY || "",
  paystackCallbackUrl: (process.env.PAYSTACK_CALLBACK_URL || `${clientUrls[0]}/payment-callback`).trim(),
  frontendUrl: process.env.FRONTEND_URL || clientUrls[0] || "http://localhost:4200",
  
  // ========================================
  // PAYSTACK CONFIGURATION DISABLED
  // Migration in progress to Yoco payment gateway
  // ========================================
  // paystackSecretKey: process.env.PAYSTACK_SECRET_KEY || "",
  // paystackPublicKey: process.env.PAYSTACK_PUBLIC_KEY || "",
  // paystackCallbackUrl: (process.env.PAYSTACK_CALLBACK_URL || `${clientUrls[0]}/payment-callback`).trim(),
  
  // Yoco Configuration (NEW)
  yocoPublicKey: process.env.YOCO_PUBLIC_KEY || "",
  yocoSecretKey: process.env.YOCO_SECRET_KEY || "",
  yocoRedirectUrl: (process.env.YOCO_REDIRECT_URL || `${clientUrls[0]}/payment-confirmation`).trim(),
  
  // Testing & Debug
  useMockPayment: process.env.USE_MOCK_PAYMENT === "true"
};

module.exports = { env };
