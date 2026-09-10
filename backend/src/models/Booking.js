const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connect");

const Booking = sequelize.define(
  "Booking",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },
    tourId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "tours",
        key: "id",
      },
    },
    bookingReference: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    tourDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    numberOfPassengers: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    totalPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "confirmed", "completed", "cancelled"),
      defaultValue: "pending",
    },
    paymentStatus: {
      type: DataTypes.ENUM("unpaid", "pending", "paid", "failed", "refunded"),
      defaultValue: "unpaid",
    },
    paystackReference: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    specialRequests: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    accommodationPreferences: {
      type: DataTypes.JSON,
      allowNull: true, // JSON with accommodation details
    },
    passengerDetails: {
      type: DataTypes.JSON,
      allowNull: true, // Array of passenger info: { name, email, phone, passportNumber }
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cancellationReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    cancellationDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    confirmationEmailSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    reminderEmailSent: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    tableName: "bookings",
  }
);

module.exports = Booking;
