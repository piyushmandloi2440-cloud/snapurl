const path = require("path");
const express = require("express");
const cors = require("cors");

// Load environment variables from server/.env
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const connectDB = require("./config/db");
const urlRoutes = require("./routes/urlRoutes");
const { redirectUrl } = require("./controllers/urlController");

// Initialize Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root health check endpoint
app.get("/", (req, res) => {
  res.json({
    status: "online",
    message: "URL Shortener Backend API Running Successfully!",
    endpoints: {
      shorten: "POST /api/shorten",
      stats: "GET /api/stats/:shortCode",
      urls: "GET /api/urls",
      redirect: "GET /:shortCode",
    },
  });
});

// Mount API routes
app.use("/api", urlRoutes);

// Mount URL Redirection route (handles /:shortCode)
app.get("/:shortCode", redirectUrl);

// 404 Catch-All Middleware for unmatched routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route not found",
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 Base URL: ${process.env.BASE_URL || `http://localhost:${PORT}`}`);
});

server.on("error", (err) => {
  if (err.code === "EADDRINUSE") {
    console.error(`❌ Port ${PORT} is already in use. Please check if another instance is running.`);
  } else {
    console.error("❌ Server Error:", err.message);
  }
});

module.exports = app;
