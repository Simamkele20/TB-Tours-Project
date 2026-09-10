const { DataTypes } = require("sequelize");
const { sequelize } = require("../db/connect");

const Tour = sequelize.define(
  "Tour",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    slug: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    shortDescription: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    pricePerPerson: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: true, // If null, use price per booking
    },
    duration: {
      type: DataTypes.STRING, // e.g., "Full Day", "Half Day", "2 Days"
      allowNull: false,
    },
    tourType: {
      type: DataTypes.STRING,
      allowNull: true, // e.g., "Private", "Group", "Self-drive"
    },
    maxPassengers: {
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue: 6,
    },
    image: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    highlights: {
      type: DataTypes.JSON,
      allowNull: true, // Array of highlights
    },
    included: {
      type: DataTypes.JSON,
      allowNull: true, // Array of included items
    },
    excluded: {
      type: DataTypes.JSON,
      allowNull: true, // Array of excluded items
    },
    itinerary: {
      type: DataTypes.JSON,
      allowNull: true, // Array of stops with time, title, description
    },
    bestTime: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    customizeInfo: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    pleaseNote: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
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
    tableName: "tours",
  }
);

module.exports = Tour;
