const rawClientUrls = process.env.CLIENT_URLS || process.env.CLIENT_URL || "http://localhost:4200";
const clientUrls = rawClientUrls
  .split(/[\s,]+/)
  .map((url) => url.trim())
  .filter(Boolean);

const env = {
  port: Number(process.env.PORT || 4000),
  clientUrl: clientUrls[0] || "http://localhost:4200",
  clientUrls,
  smtpHost: (process.env.SMTP_HOST || "").trim(),
  smtpPort: Number(process.env.SMTP_PORT || 587),
  smtpUser: (process.env.SMTP_USER || "").trim(),
  smtpPass: (process.env.SMTP_PASS || "").replace(/\s+/g, ""),
  smtpSecure: String(process.env.SMTP_SECURE || "false").toLowerCase() === "true",
  contactToEmail: (process.env.CONTACT_TO_EMAIL || "princetancu06@gmail.com").trim()
};

module.exports = { env };
