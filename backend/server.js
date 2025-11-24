// File untuk menjalankan server Express
// Kasyful Haq B.
// 17 November 2025

// Setup awal untuk koneksi pada mongo atlas
require("dotenv").config()
const express = require("express")
const app = express()
const mongoose = require("mongoose")
const jadwalRouter = require("./src/routes/jadwalRoutes")
const port = 3000

const MONGODB_URL = process.env.MONGODB_URL

// route jadwal
// Simple CORS middleware so frontend (different port) can call the API
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*")
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization")
  if (req.method === "OPTIONS") return res.sendStatus(200)
  next()
})

// Parse JSON bodies for POST/PATCH
app.use(express.json())

app.use("/api", jadwalRouter)

// coba untuk koneksi ke mongo atlas
mongoose
  .connect(MONGODB_URL)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully!")

    // Mulai hanya jika sudah sukses melakukan koneksi pada database
    app.listen(port, () => {
      console.log(`Example app listening at http://localhost:${port}`)
    })
  })
  .catch(err => {
    console.error("❌ MongoDB connection error:", err.message)
    // exit jika gagal
    process.exit(1)
  })
