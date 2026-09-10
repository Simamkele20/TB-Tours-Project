const { DataTypes } = require('sequelize');
const { sequelize } = require('../db/connect');

const Destination = sequelize.define('Destination', {
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
    allowNull: false,
    unique: true,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  shortDescription: {
    type: DataTypes.STRING,
  },
  duration: {
    type: DataTypes.STRING,
  },
  image: {
    type: DataTypes.STRING,
  },
  highlights: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  included: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  excluded: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  itinerary: {
    type: DataTypes.JSON,
    defaultValue: [],
  },
  bestTime: {
    type: DataTypes.STRING,
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
}, {
  timestamps: true,
});

module.exports = Destination;
