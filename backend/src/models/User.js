const mongoose = require("mongoose")

const userSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    namaLengkap: {
      type: String,
      required: [true, "Nama tidak boleh kosong"],
    },
    nama: {
      type: String,
    },
    email: {
      type: String,
      required: [true, "Email tidak boleh kosong"],
      unique: true, // Pastikan email unik
      lowercase: true, // Simpan sebagai huruf kecil
      match: [/.+\@.+\..+/, "Tolong masukkan email yang valid"],
    },
    password: {
      type: String,
      required: [true, "Password tidak boleh kosong"],
      // Password akan di-hash oleh Backend A (bcrypt) sebelum disimpan
    },
    noHp: {
      type: String,
      required: [true, "Nomor HP tidak boleh kosong"],
    },
    no_hp: {
      type: String,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  {
    timestamps: true, // Otomatis menambah 'createdAt' dan 'updatedAt'
  }
)

// 'User' akan menjadi nama collection 'users' di MongoDB
module.exports = mongoose.model("User", userSchema)
