const express = require("express");
const router = express.Router();
const {
  shortenUrl,
  getUrlStats,
  getAllUrls,
  deleteUrl,
} = require("../controllers/urlController");

// @route   POST /api/shorten
// @desc    Generate a short URL
router.post("/shorten", shortenUrl);

// @route   GET /api/stats/:shortCode
// @desc    Get analytics and click stats for a short URL
router.get("/stats/:shortCode", getUrlStats);

// @route   GET /api/urls
// @desc    Get list of all shortened URLs
router.get("/urls", getAllUrls);

// @route   DELETE /api/urls/:id
// @desc    Delete a shortened URL
router.delete("/urls/:id", deleteUrl);

module.exports = router;
