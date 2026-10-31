const mongoose = require("mongoose");

/**
 * URL Schema for storing original URLs and generated short codes
 */
const urlSchema = new mongoose.Schema({
  originalUrl: {
    type: String,
    required: [true, "Original URL is required"],
    trim: true,
  },
  shortCode: {
    type: String,
    required: [true, "Short code is required"],
    unique: true,
    trim: true,
    index: true,
  },
  clicks: {
    type: Number,
    required: true,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Url", urlSchema);
