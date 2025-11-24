const mongoose = require('mongoose');
const { Schema } = mongoose; // Kita butuh Schema untuk referensi

const pemesananSchema = new mongoose.Schema({
  // Custom ID manual input (like BK001, BK002)
  id: {
    type: String,
    unique: true,
    sparse: true,
    trim: true
  },
  kode_booking: {
    type: String,
    unique: true,
    sparse: true
  },
  // Ini adalah "JOIN" ke collection 'users' (Poin 5 UTS)
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User', // Referensi ke Model 'User'
    required: true
  },
  // Snapshot data user untuk performa (denormalized)
  userId: String, // Custom ID dari localStorage
  userName: String,
  userEmail: String,
  userPhone: String,
  
  // Ini adalah "JOIN" ke collection 'jadwal' (Poin 5 UTS)
  jadwal: {
    type: Schema.Types.ObjectId,
    ref: 'Jadwal', // Referensi ke Model 'Jadwal'
    required: true
  },
  // Snapshot data jadwal untuk performa (denormalized)
  scheduleId: String, // Custom ID like JDW005
  origin: String,
  destination: String,
  date: String, // Format: YYYY-MM-DD
  time: String, // Format: HH:MM
  price: Number,
  
  // Booking info
  seats: {
    type: Number,
    required: true
  },
  nomor_kursi: {
    type: [String], // Array of strings, misal: ["A1", "A2"]
    required: true
  },
  totalPrice: {
    type: Number,
    required: true
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pemesanan', pemesananSchema);