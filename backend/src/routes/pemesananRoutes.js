// Route handler untuk model 'pemesanan'
const express = require("express")
const router = require("express").Router()
const { body } = require("express-validator")

const { getPemesanan, getPemesananById, createPemesanan, updatePemesanan, deletePemesanan, updatePaymentStatus, confirmPemesanan, cancelPemesanan, completePemesanan } = require("../controllers/pemesananController")

// GET all pemesanan
router.get("/pemesanan", getPemesanan)

// GET single
router.get("/pemesanan/:id", getPemesananById)

// POST create
router.post(
  "/pemesanan",
  body("user").notEmpty().isMongoId().withMessage("user harus berisi ObjectId yang valid"),
  body("jadwal").notEmpty().isMongoId().withMessage("jadwal harus berisi ObjectId yang valid"),
  body("jumlah_penumpang").isInt({ min: 1 }).withMessage("jumlah_penumpang harus berupa integer >= 1"),
  body("nomor_kursi").isArray({ min: 1 }).withMessage("nomor_kursi harus berupa array dengan minimal 1 item"),
  body("total_harga").isInt({ min: 0 }).withMessage("total_harga harus berupa angka"),
  createPemesanan
)

// PATCH update general
router.patch("/pemesanan/:id", updatePemesanan)

// DELETE
router.delete("/pemesanan/:id", deletePemesanan)

// PATCH status (generic)
router.patch("/pemesanan/:id/status", body("status_pembayaran").optional().isIn(["pending", "success", "cancelled"]), body("status").optional().isIn(["pending", "confirmed", "completed", "cancelled"]), updatePaymentStatus)

// Convenience actions
router.patch("/pemesanan/:id/confirm", confirmPemesanan)
router.patch("/pemesanan/:id/cancel", cancelPemesanan)
router.patch("/pemesanan/:id/complete", completePemesanan)

module.exports = router
