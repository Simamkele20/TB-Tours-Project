const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const logoAssetCandidates = [
  path.resolve(__dirname, "../../../frontend/public/images/tb-tours-logo-transparent.png"),
  path.resolve(__dirname, "../../../frontend/public/images/tb-tours-logo.jpg")
];

const logoAssetPath = logoAssetCandidates.find((candidate) => fs.existsSync(candidate)) || "";

const formatCurrency = (amount) => `R ${Number(amount || 0).toFixed(2)}`;

const createInvoicePdf = (booking) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    if (logoAssetPath) {
      doc.image(logoAssetPath, 50, 44, { fit: [96, 72], align: "left" });
      doc.fillColor("#121212").fontSize(22).text("TB Tours Invoice", 158, 58);
      doc.moveDown(1.8);
    } else {
      doc.fillColor("#121212").fontSize(22).text("TB Tours Invoice", { align: "left" });
      doc.moveDown(0.3);
    }

    doc.fontSize(10).fillColor("#5b6578").text("TB Tours");
    doc.text("Cape Town, Western Cape");
    doc.text("traveling.buddies@tb-tours.com");
    doc.text("073 448 3958");

    doc.moveDown(1.2);
    doc.fillColor("#121212").fontSize(12).text("Customer Details", { underline: true });
    doc.moveDown(0.4);
    doc.fontSize(11).text(`Name: ${booking.fullName}`);
    doc.text(`Email: ${booking.email || "N/A"}`);
    doc.text(`Phone: ${booking.phone || "N/A"}`);

    doc.moveDown(1.1);
    doc.fillColor("#121212").fontSize(12).text("Booking Summary", { underline: true });
    doc.moveDown(0.4);
    doc.fontSize(11).text(`Service: ${booking.serviceName}`);
    doc.text(`Travel Date: ${booking.travelDate || "N/A"}`);
    doc.text(`Pickup: ${booking.pickupLocation || "N/A"}`);
    doc.text(`Dropoff: ${booking.dropoffLocation || "N/A"}`);
    doc.text(`Passengers: ${booking.passengers || "N/A"}`);
    doc.text(`Amount Paid: ${formatCurrency(booking.amountZar)}`);
    doc.text("Payment Status: Paid");

    if (booking.notes) {
      doc.moveDown(0.8);
      doc.fillColor("#121212").fontSize(12).text("Notes", { underline: true });
      doc.moveDown(0.3);
      doc.fontSize(11).fillColor("#3a3f4b").text(booking.notes);
    }

    doc.moveDown(1.5);
    doc.fontSize(10).fillColor("#5b6578").text("Thank you for choosing TB Tours.");
    doc.text("This document serves as your payment invoice.");

    doc.end();
  });

module.exports = { createInvoicePdf, formatCurrency };
