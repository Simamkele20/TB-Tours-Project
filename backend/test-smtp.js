require("dotenv").config({ path: ".env.develop" });
const nodemailer = require("nodemailer");
const dns = require("node:dns");

dns.setDefaultResultOrder("ipv4first");

const testSMTP = async () => {
  console.log("Testing SMTP Connection...");
  console.log("SMTP_HOST:", process.env.SMTP_HOST);
  console.log("SMTP_PORT:", process.env.SMTP_PORT);
  console.log("SMTP_USER:", process.env.SMTP_USER);
  console.log("SMTP_SECURE:", process.env.SMTP_SECURE);
  console.log("---");

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: String(process.env.SMTP_SECURE).toLowerCase() === "true",
    connectionTimeout: 15000,
    greetingTimeout: 10000,
    socketTimeout: 20000,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });

  try {
    console.log("Attempting to verify SMTP connection...");
    const verified = await transporter.verify();
    
    if (verified) {
      console.log("✓ SMTP connection successful!");
      console.log("✓ Server is ready to send emails");
      
      // Optional: Send a test email
      console.log("\nSending test email...");
      const info = await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.CONTACT_TO_EMAIL,
        subject: "SMTP Test - Connection Verified",
        text: "This is a test email to verify SMTP configuration is working correctly.",
        html: "<p>This is a test email to verify SMTP configuration is working correctly.</p>"
      });
      
      console.log("✓ Test email sent successfully!");
      console.log("Message ID:", info.messageId);
    } else {
      console.log("✗ SMTP connection failed");
    }
  } catch (error) {
    console.error("✗ SMTP Error:", error.message);
    if (error.response) {
      console.error("Response:", error.response);
    }
  }
};

testSMTP();
