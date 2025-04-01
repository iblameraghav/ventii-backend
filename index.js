import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";  // Import CORS middleware
import authRoute from "./routes/auth.js";
import usersRoute from "./routes/users.js";
import roomsRoute from "./routes/rooms.js";
import hotelsRoute from "./routes/hotels.js";

const app = express();
dotenv.config();

// MongoDB connection
const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("✅ Connected to MongoDB.");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("❌ MongoDB disconnected.");
});

mongoose.connection.on("connected", () => {
  console.log("✅ MongoDB connected.");
});

// Middleware
app.use(cors({ 
  origin: "http://localhost:3000", // Allow frontend origin
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true 
}));

app.use(express.json());

// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/hotels", hotelsRoute);
app.use("/api/rooms", roomsRoute);

// Error handling middleware
app.use((err, req, res, next) => {
  const errorStatus = err.status || 500;
  const errorMessage = err.message || "Something went wrong";
  return res.status(errorStatus).json({
    success: false,
    status: errorStatus,
    message: errorMessage,
    stack: err.stack,
  });
});

// Start server
app.listen(8800, () => {
  connect();
  console.log("🚀 Backend server running on port 8800.");
});
