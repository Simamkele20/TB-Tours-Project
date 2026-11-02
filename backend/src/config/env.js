const rawClientUrls = process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:4200";
const clientUrls = rawClientUrls
  .split(/[\s,]+/)
  .map((url) => url.trim())
  .filter(Boolean);

const buildPostgresUrlFromParts = () => {
  const host = (process.env.PGHOST || "").trim();
  const port = (process.env.PGPORT || "5432").trim();
  const database = (process.env.PGDATABASE || "").trim();
  const user = (process.env.PGUSER || "").trim();
  const password = process.env.PGPASSWORD || "";

  if (!host || !database || !user) {
    return "";
  }

  const encodedUser = encodeURIComponent(user);
  const encodedPassword = encodeURIComponent(password);
  const encodedDb = encodeURIComponent(database);

  return `postgresql://${encodedUser}:${encodedPassword}@${host}:${port}/${encodedDb}`;
};

const resolveDatabaseUrl = () => {
  const rawDatabaseUrl = (process.env.DATABASE_URL || "").trim();
  if (rawDatabaseUrl) {
    return rawDatabaseUrl;
  }

  return buildPostgresUrlFromParts();
};

const validateDatabaseUrl = (databaseUrl) => {
  if (!databaseUrl) {
    return "";
  }

  let parsed;
  try {
    parsed = new URL(databaseUrl);
  } catch (_error) {
    return "DATABASE_URL is not a valid URL. Expected format: postgresql://user:password@host:5432/database";
  }

  if (!['postgres:', 'postgresql:'].includes(parsed.protocol)) {
    return `DATABASE_URL must use postgres/postgresql protocol. Received: ${parsed.protocol}`;
  }

  const hostname = parsed.hostname || "";
  if (/^dpg-[a-z0-9-]+$/i.test(hostname)) {
    return "DATABASE_URL host appears incomplete (short Render host without domain). Use the full External Database URL from Render (host should look like dpg-xxxx.region-postgres.render.com).";
  }

  return "";
};

const databaseUrl = resolveDatabaseUrl();
const databaseConfigError = validateDatabaseUrl(databaseUrl);

const env = {
  port: Number(process.env.PORT || 4000),
  nodeEnv: process.env.NODE_ENV || "development",
  clientUrl: clientUrls[0] || "http://localhost:4200",
  clientUrls,
  mailgunApiKey: (process.env.MAILGUN_API_KEY || "").trim(),
  mailgunDomain: (process.env.MAILGUN_DOMAIN || "sandboxf1e866405b11426296207bac0d2f4cca.mailgun.org").trim(),
  contactToEmail: (process.env.CONTACT_TO_EMAIL || "info@tb-tours.co.za").trim(),
  // Database Configuration (PostgreSQL for Render, MySQL for local development)
  databaseUrl,
  databaseConfigError,
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
