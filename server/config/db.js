const mongoose = require("mongoose");

/**
 * Connect to MongoDB database using Mongoose
 */
const connectDB = async () => {
  // Listen for ongoing connection errors to prevent unhandled EventEmitter exceptions
  mongoose.connection.on("error", (err) => {
    console.error(`❌ MongoDB Runtime Error: ${err.message}`);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("⚠️  MongoDB disconnected.");
  });

  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/url_shortener";

    if (!mongoUri || mongoUri === "your_mongodb_connection_string") {
      console.warn("⚠️  [MongoDB Warning] MONGO_URI is set to a placeholder or missing.");
      console.warn("⚠️  Please configure a valid connection string in server/.env");
      return;
    }

    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });

    console.log(`✅ MongoDB Connected successfully: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.error("👉 Please ensure MongoDB is running locally or provide a valid Atlas MONGO_URI in .env");
  }
};

module.exports = connectDB;

