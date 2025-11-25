// 1. PANGGIL DOTENV DI BARIS PALING ATAS!
// Ini agar Node.js bisa MEMBACA file .env
require('dotenv').config();

const mongoose = require('mongoose');

// 2. Ambil URI dari variabel yang sudah dibaca .env
const mongoURI = process.env.MONGODB_URI;

// Cek apakah URI-nya ada
if (!mongoURI) {
  console.error('Koneksi GAGAL: MONGODB_URI tidak ditemukan di file .env');
  process.exit(1); // Keluar dari script dengan status error
}

console.log('Mencoba terhubung ke MongoDB Atlas...');
console.log('(Pastikan IP 0.0.0.0/0 sudah di-whitelist dan password benar)');

// 3. Coba Sambungkan ke Atlas
mongoose.connect(mongoURI)
  .then(() => {
    // Jika BERHASIL
    console.log('=================================================');
    console.log('BERHASIL! Koneksi ke MongoDB Atlas sukses!');
    console.log('=================================================');
    process.exit(0); // Keluar dari script dengan status sukses
  })
  .catch((err) => {
    // Jika GAGAL
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.error('Koneksi GAGAL. Cek error di bawah ini:');
    console.error('!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
    console.error(err.message); // Tampilkan pesan error (misal: auth failed, timeout)
    process.exit(1); // Keluar dengan error
  });