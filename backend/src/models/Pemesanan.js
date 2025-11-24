const mongoose = require('mongoose');
const { Schema } = mongoose; // Kita butuh Schema untuk referensi

const pemesananSchema = new mongoose.Schema({
  kode_booking: {
    type: String,
    required: true,
    unique: true
  },
  // Ini adalah "JOIN" ke collection 'users' (Poin 5 UTS)
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Referensi ke Model 'User'
    required: true
  },
  // Ini adalah "JOIN" ke collection 'jadwal' (Poin 5 UTS)
  jadwal: {
    type: Schema.Types.ObjectId,
    ref: 'Jadwal', // Referensi ke Model 'Jadwal'
    required: true
  },
  tanggal_pesan: {
    type: Date,
    default: Date.now
  },
  jumlah_penumpang: {
    type: Number,
    required: true
  },
  nomor_kursi: {
    type: [String], // Array of strings, misal: ["A1", "A2"]
    required: true
  },
  total_harga: {
    type: Number,
    required: true
  },
  status_pembayaran: {
    type: String,
    enum: ['pending', 'success', 'cancelled'], // Hanya boleh diisi 3 nilai ini
    default: 'pending'
  },
  // Human-friendly booking lifecycle status used by frontend
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pemesanan', pemesananSchema);