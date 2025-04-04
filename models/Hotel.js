import mongoose from "mongoose";

const HotelSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  countryCode: { type: String, required: true },
  phone: { type: String, required: true },
  hotelName: { type: String, required: true },
  hotelType: { type: String, required: true },
  city: { type: String, required: true },
  distance: { type: String, required: true },
  address: { type: String, required: true },
  description: { type: String, required: true },
  location: { type: String, required: true },
  pricePerNight: { type: Number, required: true },
  images: { type: [String], default: [] }, // Ensure images array exists
}, { timestamps: true });

export default mongoose.model("Hotel", HotelSchema);
