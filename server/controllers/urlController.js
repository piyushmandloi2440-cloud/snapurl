const crypto = require("crypto");
const mongoose = require("mongoose");
const Url = require("../models/Url");

/**
 * Validate URL string format and protocol
 * @param {string} stringUrl
 * @returns {boolean}
 */
const isValidUrl = (stringUrl) => {
  if (!stringUrl || typeof stringUrl !== "string") return false;

  try {
    const parsed = new URL(stringUrl.trim());
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (err) {
    return false;
  }
};

/**
 * Generate a random 6-8 character alphanumeric short code
 * @param {number} length
 * @returns {string}
 */
const generateCode = (length = 6) => {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const bytes = crypto.randomBytes(length);
  let result = "";
  for (let i = 0; i < length; i++) {
    result += chars[bytes[i] % chars.length];
  }
  return result;
};

/**
 * Helper to construct the full short URL
 * @param {Object} req - Express request object
 * @param {string} shortCode - The generated short code
 * @returns {string}
 */
const getFullShortUrl = (req, shortCode) => {
  const baseUrl = process.env.BASE_URL && process.env.BASE_URL.trim() !== ""
    ? process.env.BASE_URL.replace(/\/+$/, "")
    : `${req.protocol}://${req.get("host")}`;

  return `${baseUrl}/${shortCode}`;
};

/**
 * Helper to check whether MongoDB is currently connected
 * @param {Object} res
 * @returns {boolean}
 */
const isDbConnected = (res) => {
  if (mongoose.connection.readyState !== 1) {
    res.status(503).json({
      success: false,
      message: "Database is not connected. Please ensure MongoDB is running and MONGO_URI in server/.env is valid.",
    });
    return false;
  }
  return true;
};

/**
 * @desc    Shorten a long URL
 * @route   POST /api/shorten
 * @access  Public
 */
const shortenUrl = async (req, res) => {
  try {
    const inputUrl = req.body.originalUrl || req.body.url || req.body.longUrl;

    if (!inputUrl) {
      return res.status(400).json({
        success: false,
        message: "URL is required. Please provide a URL in the request body.",
      });
    }

    const trimmedUrl = inputUrl.trim();

    // Validate URL
    if (!isValidUrl(trimmedUrl)) {
      return res.status(400).json({
        success: false,
        message: "Invalid URL format. Please provide a valid URL starting with http:// or https://",
      });
    }

    if (!isDbConnected(res)) return;

    // Check if the original URL is already shortened in the database
    let existingUrl = await Url.findOne({ originalUrl: trimmedUrl });
    if (existingUrl) {
      const shortUrl = getFullShortUrl(req, existingUrl.shortCode);
      return res.status(200).json({
        success: true,
        message: "URL already shortened. Returning existing link.",
        data: {
          _id: existingUrl._id,
          originalUrl: existingUrl.originalUrl,
          shortCode: existingUrl.shortCode,
          shortUrl,
          clicks: existingUrl.clicks,
          createdAt: existingUrl.createdAt,
        },
      });
    }

    // Generate unique short code (avoid collisions)
    let shortCode = "";
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 10;

    while (!isUnique && attempts < maxAttempts) {
      // Generate a 6-character code (or 7 after a few attempts)
      const codeLength = attempts < 5 ? 6 : 7;
      shortCode = generateCode(codeLength);

      const existingCode = await Url.findOne({ shortCode });
      if (!existingCode) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({
        success: false,
        message: "Failed to generate a unique short code. Please try again.",
      });
    }

    // Create and save new URL record in MongoDB
    const newUrl = new Url({
      originalUrl: trimmedUrl,
      shortCode,
      clicks: 0,
    });

    await newUrl.save();

    const shortUrl = getFullShortUrl(req, shortCode);

    return res.status(201).json({
      success: true,
      message: "Short URL generated successfully!",
      data: {
        _id: newUrl._id,
        originalUrl: newUrl.originalUrl,
        shortCode: newUrl.shortCode,
        shortUrl,
        clicks: newUrl.clicks,
        createdAt: newUrl.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in shortenUrl controller:", error);
    return res.status(500).json({
      success: false,
      message: "Server error while shortening the URL.",
      error: error.message,
    });
  }
};

/**
 * @desc    Redirect to original URL using short code
 * @route   GET /:shortCode
 * @access  Public
 */
const redirectUrl = async (req, res) => {
  try {
    const { shortCode } = req.params;

    // Ignore requests for favicon, robots, or system paths
    if (!shortCode || shortCode === "favicon.ico" || shortCode === "robots.txt") {
      return res.status(204).end();
    }

    if (!isDbConnected(res)) return;

    // Find the URL document
    const urlDoc = await Url.findOne({ shortCode });

    if (!urlDoc) {
      // Check if client expects HTML or JSON
      if (req.accepts("html")) {
        return res.status(404).send(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>404 - Link Not Found</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                background-color: #0f172a;
                color: #e2e8f0;
                display: flex;
                align-items: center;
                justify-content: center;
                min-height: 100vh;
                margin: 0;
                padding: 1rem;
              }
              .card {
                background: #1e293b;
                border: 1px solid #334155;
                padding: 2.5rem;
                border-radius: 1rem;
                text-align: center;
                max-width: 480px;
                box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.4);
              }
              h1 { font-size: 3rem; margin: 0 0 1rem; color: #ef4444; }
              p { font-size: 1.1rem; line-height: 1.6; color: #94a3b8; }
              a {
                display: inline-block;
                margin-top: 1.5rem;
                padding: 0.75rem 1.5rem;
                background: #6366f1;
                color: #ffffff;
                text-decoration: none;
                border-radius: 0.5rem;
                font-weight: 600;
                transition: background 0.2s;
              }
              a:hover { background: #4f46e5; }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>404</h1>
              <h2>Link Not Found</h2>
              <p>The shortened link you are trying to visit does not exist or may have been removed.</p>
              <a href="http://localhost:5173">Go to URL Shortener</a>
            </div>
          </body>
          </html>
        `);
      }

      return res.status(404).json({
        success: false,
        message: "Short URL not found. The link does not exist or may have been deleted.",
      });
    }

    // Increment click counter atomically
    await Url.findByIdAndUpdate(urlDoc._id, { $inc: { clicks: 1 } });

    // Perform HTTP 302 redirect
    return res.redirect(urlDoc.originalUrl);
  } catch (error) {
    console.error("Error in redirectUrl controller:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during URL redirection.",
      error: error.message,
    });
  }
};

/**
 * @desc    Get analytics/stats for a short URL
 * @route   GET /api/stats/:shortCode
 * @access  Public
 */
const getUrlStats = async (req, res) => {
  try {
    const { shortCode } = req.params;

    if (!isDbConnected(res)) return;

    const urlDoc = await Url.findOne({ shortCode });

    if (!urlDoc) {
      return res.status(404).json({
        success: false,
        message: `No shortened URL found for code '${shortCode}'.`,
      });
    }

    const shortUrl = getFullShortUrl(req, urlDoc.shortCode);

    return res.status(200).json({
      success: true,
      data: {
        _id: urlDoc._id,
        originalUrl: urlDoc.originalUrl,
        shortCode: urlDoc.shortCode,
        shortUrl,
        clicks: urlDoc.clicks,
        createdAt: urlDoc.createdAt,
      },
    });
  } catch (error) {
    console.error("Error in getUrlStats controller:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching URL stats.",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all shortened URLs (recent first)
 * @route   GET /api/urls
 * @access  Public
 */
const getAllUrls = async (req, res) => {
  try {
    if (!isDbConnected(res)) return;

    const urls = await Url.find().sort({ createdAt: -1 }).limit(50);

    const urlsWithFullUrl = urls.map((url) => ({
      _id: url._id,
      originalUrl: url.originalUrl,
      shortCode: url.shortCode,
      shortUrl: getFullShortUrl(req, url.shortCode),
      clicks: url.clicks,
      createdAt: url.createdAt,
    }));

    return res.status(200).json({
      success: true,
      count: urlsWithFullUrl.length,
      data: urlsWithFullUrl,
    });
  } catch (error) {
    console.error("Error in getAllUrls controller:", error);
    return res.status(500).json({
      success: false,
      message: "Server error fetching URLs list.",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete a shortened URL
 * @route   DELETE /api/urls/:id
 * @access  Public
 */
const deleteUrl = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isDbConnected(res)) return;

    const urlDoc = await Url.findByIdAndDelete(id);

    if (!urlDoc) {
      return res.status(404).json({
        success: false,
        message: "URL not found or already deleted.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Shortened URL deleted successfully.",
    });
  } catch (error) {
    console.error("Error in deleteUrl controller:", error);
    return res.status(500).json({
      success: false,
      message: "Server error deleting URL.",
      error: error.message,
    });
  }
};

module.exports = {
  shortenUrl,
  redirectUrl,
  getUrlStats,
  getAllUrls,
  deleteUrl,
};
