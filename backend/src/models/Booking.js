const mongoose = require("mongoose");
const { attachSequelizeLikeMethods } = require("./modelHelpers");

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    tourId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tour",
      default: null,
    },
    bookingReference: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    tourDate: {
      type: Date,
      required: true,
    },
    numberOfPassengers: {
      type: Number,
      required: true,
      min: 1,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["unpaid", "pending", "paid", "failed", "refunded"],
      default: "unpaid",
    },
    paystackReference: {
      type: String,
      default: null,
    },
    paymentReference: {
      type: String,
      default: null,
    },
    transactionId: {
      type: String,
      default: null,
    },
    paymentDate: {
      type: Date,
      default: null,
    },
    refundAmount: {
      type: Number,
      default: null,
    },
    refundDate: {
      type: Date,
      default: null,
    },
    specialRequests: {
      type: String,
      default: null,
    },
    accommodationPreferences: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    passengerDetails: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    notes: {
      type: String,
      default: null,
    },
    cancellationReason: {
      type: String,
      default: null,
    },
    cancellationDate: {
      type: Date,
      default: null,
    },
    confirmationEmailSent: {
      type: Boolean,
      default: false,
    },
    reminderEmailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

attachSequelizeLikeMethods(bookingSchema, {
  User: "userId",
  Tour: "tourId",
});

module.exports = mongoose.models.Booking || mongoose.model("Booking", bookingSchema);
