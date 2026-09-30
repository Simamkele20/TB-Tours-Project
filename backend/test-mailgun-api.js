require("dotenv").config({ path: ".env.develop" });
const FormData = require("form-data");
const Mailgun = require("mailgun.js");
const https = require("https");

const testMailgunAPI = async () => {
  console.log("Testing Mailgun API...");
  console.log("API Key:", process.env.MAILGUN_API_KEY ? "✓ Set" : "✗ Missing");
  console.log("Domain:", process.env.MAILGUN_DOMAIN);
  console.log("---");

  try {
    // Disable SSL verification for development
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    
    const mailgun = new Mailgun(FormData);
    const mg = mailgun.client({
      username: "api",
      key: process.env.MAILGUN_API_KEY
    });

    const data = await mg.messages.create(process.env.MAILGUN_DOMAIN, {
      from: `TB Tours <noreply@${process.env.MAILGUN_DOMAIN}>`,
      to: [process.env.CONTACT_TO_EMAIL || "princetancu06@gmail.com"],
      subject: "✓ TB Tours Mailgun API Test - Production Domain",
      text: "This email was sent successfully using the Mailgun API with the production domain!",
      html: "<p>This email was sent successfully using the <strong>Mailgun API</strong> with the <strong>production domain</strong>!</p>"
    });

    console.log("✓ Email sent successfully!");
    console.log("Message ID:", data.id);
    console.log("\nYou should now see this email in Mailgun logs under tb-tours.co.za");
  } catch (error) {
    console.error("✗ Error:", error.message);
    if (error.response) {
      console.error("Response:", error.response);
    }
  }
};

testMailgunAPI();
