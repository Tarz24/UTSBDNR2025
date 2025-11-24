const mongoose = require("mongoose")

const jadwalSchema = new mongoose.Schema(
  {
    // Custom human-friendly ID (e.g., JDW005). Optional and unique when provided.
    id: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      uppercase: true,
    },
    // Modern field names
    origin: {
      type: String,
      index: true,
    },
    destination: {
      type: String,
      index: true,
    },
    date: {
      type: String, // YYYY-MM-DD format
    },
    time: {
      type: String, // HH:MM format
    },
    price: {
      type: Number,
    },
    seats: {
      type: Number,
      default: 20,
    },
    availableSeats: {
      type: Number,
      default: 20,
    },
    status: {
      type: String,
      enum: ["active", "completed", "cancelled"],
      default: "active",
    },
    // Legacy field names for backward compatibility
    rute_awal: {
      type: String,
      index: true,
    },
    rute_tujuan: {
      type: String,
      index: true,
    },
    pool_keberangkatan: {
      type: String,
    },
    pool_tujuan: {
      type: String,
    },
    jam_berangkat: {
      type: Date,
    },
    estimasi_jam_tiba: {
      type: Date,
    },
    harga: {
      type: Number,
    },
    total_kursi: {
      type: Number,
      default: 20,
    },
    kursi_tersedia: {
      type: Number,
      default: 20,
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Jadwal", jadwalSchema)
