const buildContactEmailText = (contactMessage) =>
  [
    "New contact message from TB Tours (Pty)Ltd website",
    "",
    `Name: ${contactMessage.name}`,
    `Email: ${contactMessage.email}`,
    `Phone: ${contactMessage.phone}`,
    "",
    "Message:",
    contactMessage.message
  ].join("\n");

module.exports = { buildContactEmailText };
