const mongoose = require("mongoose");
const { attachSequelizeLikeMethods } = require("./modelHelpers");

const destinationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
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
    duration: {
      type: String,
      default: null,
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
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

attachSequelizeLikeMethods(destinationSchema);

module.exports = mongoose.models.Destination || mongoose.model("Destination", destinationSchema);
