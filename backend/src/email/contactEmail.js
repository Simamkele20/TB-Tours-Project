const buildContactEmailText = (contactMessage) =>
  [
    "New contact message from TB Tours website",
    "",
    `Name: ${contactMessage.name}`,
    `Email: ${contactMessage.email}`,
    `Phone: ${contactMessage.phone}`,
    `Service: ${contactMessage.service}`,
    "",
    "Message:",
    contactMessage.message
  ].join("\n");

module.exports = { buildContactEmailText };
