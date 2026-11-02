const mongoose = require("mongoose");
const { attachSequelizeLikeMethods } = require("./modelHelpers");

const tourSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    shortDescription: {
      type: String,
      default: null,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    pricePerPerson: {
      type: Number,
      default: null,
    },
    duration: {
      type: String,
      required: true,
    },
    tourType: {
      type: String,
      default: null,
    },
    maxPassengers: {
      type: Number,
      default: 6,
    },
    image: {
      type: String,
      default: null,
    },
    highlights: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    included: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    excluded: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    itinerary: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
    bestTime: {
      type: String,
      default: null,
    },
    customizeInfo: {
      type: String,
      default: null,
    },
    pleaseNote: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

attachSequelizeLikeMethods(tourSchema);

module.exports = mongoose.models.Tour || mongoose.model("Tour", tourSchema);
