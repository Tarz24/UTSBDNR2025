const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  nama: {
    type: String,
    required: [true, 'Nama tidak boleh kosong']
  },
  email: {
    type: String,
    required: [true, 'Email tidak boleh kosong'],
    unique: true, // Pastikan email unik
    lowercase: true, // Simpan sebagai huruf kecil
    match: [/.+\@.+\..+/, 'Tolong masukkan email yang valid']
  },
  password: {
    type: String,
    required: [true, 'Password tidak boleh kosong']
    // Password akan di-hash oleh Backend A (bcrypt) sebelum disimpan
  },
  no_hp: {
    type: String,
    required: [true, 'Nomor HP tidak boleh kosong']
  }
}, {
  timestamps: true // Otomatis menambah 'createdAt' dan 'updatedAt'
});

// 'User' akan menjadi nama collection 'users' di MongoDB
module.exports = mongoose.model('User', userSchema);