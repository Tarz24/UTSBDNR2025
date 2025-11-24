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
    rute_awal: {
      type: String,
      required: true,
      index: true, // PENTING: untuk mempercepat query pencarian
    },
    rute_tujuan: {
      type: String,
      required: true,
      index: true, // PENTING: untuk mempercepat query pencarian
    },
    pool_keberangkatan: {
      type: String,
      required: true,
    },
    pool_tujuan: {
      type: String,
      required: true,
    },
    jam_berangkat: {
      type: Date,
      required: true,
    },
    estimasi_jam_tiba: {
      type: Date,
      required: true,
    },
    harga: {
      type: Number,
      required: true,
    },
    total_kursi: {
      type: Number,
      default: 20, // Asumsi default 20 kursi
    },
    kursi_tersedia: {
      type: Number,
      default: 20,
      // Nanti akan di-update (dikurangi) oleh Backend B saat ada booking
    },
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model("Jadwal", jadwalSchema)
