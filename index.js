import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import path from "path";
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import roomsRoute from "./routes/rooms.js";
import hotelsRoute from "./routes/hotels.js";

dotenv.config(); // Load environment variables first

const app = express();

// MongoDB connection
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ Connected to MongoDB.");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};

mongoose.connection.on("disconnected", () => console.log("❌ MongoDB disconnected."));
mongoose.connection.on("connected", () => console.log("✅ MongoDB connected."));

// Middleware
app.use(cors({ 
  origin: "http://localhost:3000", // Allow frontend requests
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true 
}));

app.use(express.json({ limit: "50mb" })); // ✅ Fix for PayloadTooLargeError
app.use(express.urlencoded({ limit: "50mb", extended: true })); // ✅ Fix for large URL-encoded data

// Serve uploaded images
app.use("/uploads", express.static(path.join(path.resolve(), "uploads")));

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err); // Log error for debugging
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Show stack trace only in dev
  });
});

// Handle unexpected errors
process.on("uncaughtException", (err) => {
  console.error("❌ Uncaught Exception:", err);
  process.exit(1);
});

// Start server
app.listen(8800, () => {
  connect();
  console.log("🚀 Backend server running on port 8800.");
});
