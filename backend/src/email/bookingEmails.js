const { createInvoicePdf } = require("./invoice");

const sendPaidBookingEmails = async ({ mailTransporter, smtpUser, contactToEmail, booking }) => {
  const businessEmailText = [
    "Paid booking confirmed from TB Tours website",
    "",
    `Amount (ZAR): ${booking.amountZar}`,
    `Name: ${booking.fullName}`,
    `Email: ${booking.email}`,
    `Phone: ${booking.phone}`,
    `Service: ${booking.serviceName}`,
    `Pickup: ${booking.pickupLocation}`,
    `Dropoff: ${booking.dropoffLocation}`,
    `Travel Date: ${booking.travelDate}`,
    `Passengers: ${booking.passengers}`,
    "",
    "Notes:",
    booking.notes || "(none)"
  ].join("\n");

  const customerEmailText = [
    `Hi ${booking.fullName},`,
    "",
    "Thank you for booking with TB Tours.",
    "Your payment was successful and your booking is confirmed.",
    `Service: ${booking.serviceName}`,
    `Travel Date: ${booking.travelDate}`,
    `Pickup: ${booking.pickupLocation}`,
    `Dropoff: ${booking.dropoffLocation}`,
    `Passengers: ${booking.passengers}`,
    `Amount Paid (ZAR): ${booking.amountZar}`,
    "",
    "Kindly find your invoice attached.",
    "Thank you for choosing TB Tours."
  ].join("\n");

  const invoicePdf = await createInvoicePdf(booking);
  const invoiceFilename = `tb-tours-invoice-${new Date().toISOString().slice(0, 10)}.pdf`;
  const invoiceAttachment = {
    filename: invoiceFilename,
    content: invoicePdf,
    contentType: "application/pdf"
  };

  await mailTransporter.sendMail({
    from: `TB Tours Bookings <${smtpUser}>`,
    to: contactToEmail,
    replyTo: booking.email || undefined,
    subject: `TB Tours Paid Booking: ${booking.fullName}`,
    text: businessEmailText,
    attachments: [invoiceAttachment]
  });

  if (booking.email) {
    await mailTransporter.sendMail({
      from: `TB Tours <${smtpUser}>`,
      to: booking.email,
      subject: "TB Tours Booking Confirmation",
      text: customerEmailText,
      attachments: [invoiceAttachment]
    });
  }
};

module.exports = { sendPaidBookingEmails };
