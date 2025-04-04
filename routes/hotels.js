import express from "express";
import multer from "multer";
import path from "path";
import Hotel from "../models/Hotel.js";

const router = express.Router();

// Configure Multer for storing images in "uploads" folder
const storage = multer.diskStorage({
  destination: "./uploads/",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Create a hotel with image upload
router.post("/", upload.array("images", 5), async (req, res) => {
  try {
    const imageUrls = req.files.map(file => `http://localhost:8800/uploads/${file.filename}`);

    const newHotel = new Hotel({
      ...req.body,
      images: imageUrls, // Store image URLs instead of Base64
    });

    const savedHotel = await newHotel.save();
    res.status(200).json(savedHotel);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Update hotel
router.put("/:id", upload.array("images", 5), async (req, res) => {
  try {
    let updatedData = { ...req.body };

    // If new images are uploaded, update them
    if (req.files && req.files.length > 0) {
      updatedData.images = req.files.map(file => `http://localhost:8800/uploads/${file.filename}`);
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: updatedData },
      { new: true }
    );

    res.status(200).json(updatedHotel);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Delete a hotel
router.delete("/:id", async (req, res) => {
  try {
    await Hotel.findByIdAndDelete(req.params.id);
    res.status(200).json("Hotel has been deleted");
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get a specific hotel
router.get("/:id", async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    res.status(200).json(hotel);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Get all hotels
router.get("/", async (req, res) => {
  try {
    const hotels = await Hotel.find();
    res.status(200).json(hotels);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Serve uploaded images
router.use("/uploads", express.static("uploads"));

export default router;
