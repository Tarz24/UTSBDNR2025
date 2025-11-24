// Controller untuk Pemesanan (Bookings) - versi sederhana tanpa populate/agregasi
const { validationResult } = require("express-validator")
const PemesananModel = require("../models/Pemesanan")
const mongoose = require("mongoose")

// GET /pemesanan
// Fitur: filter, sort, limit, page, join (lookup user & jadwal), meta
// Query params yang didukung:
//  - kode_booking, status, status_pembayaran, user, jadwal
//  - tanggal_pesan_from, tanggal_pesan_to (ISO date)
//  - sort=field,-otherField  (default: -createdAt)
//  - limit=number (default 50)
//  - page=number (default 1)
//  - join=true (aktifkan $lookup)
//  - meta=true (kembalikan {data, meta})
//  - aggregate=true (alias join=true)
const getPemesanan = async (req, res) => {
  try {
    const { kode_booking, status, status_pembayaran, user, jadwal, tanggal_pesan_from, tanggal_pesan_to, sort = "-createdAt", limit = "50", page = "1", join, aggregate, meta } = req.query

    // Build filter object
    const match = {}
    if (kode_booking) match.kode_booking = kode_booking
    if (status) match.status = status
    if (status_pembayaran) match.status_pembayaran = status_pembayaran
    if (user && mongoose.Types.ObjectId.isValid(user)) match.user = new mongoose.Types.ObjectId(user)
    if (jadwal && mongoose.Types.ObjectId.isValid(jadwal)) match.jadwal = new mongoose.Types.ObjectId(jadwal)
    if (tanggal_pesan_from || tanggal_pesan_to) {
      match.tanggal_pesan = {}
      if (tanggal_pesan_from) match.tanggal_pesan.$gte = new Date(tanggal_pesan_from)
      if (tanggal_pesan_to) match.tanggal_pesan.$lte = new Date(tanggal_pesan_to)
    }

    const limitNum = Math.min(Math.max(parseInt(limit, 10) || 50, 1), 500) // cap 500
    const pageNum = Math.max(parseInt(page, 10) || 1, 1)
    const skipNum = (pageNum - 1) * limitNum

    // Parse sort
    const sortObj = {}
    if (sort) {
      const parts = String(sort).split(",")
      parts.forEach(p => {
        const trimmed = p.trim()
        if (!trimmed) return
        if (trimmed.startsWith("-")) {
          sortObj[trimmed.slice(1)] = -1
        } else {
          sortObj[trimmed] = 1
        }
      })
    }
    if (Object.keys(sortObj).length === 0) sortObj.createdAt = -1

    const useAggregation = join === "true" || aggregate === "true"

    // Jika tidak perlu aggregation, gunakan find biasa (lebih cepat)
    if (!useAggregation) {
      const cursor = PemesananModel.find(match).sort(sortObj).skip(skipNum).limit(limitNum)
      const docs = await cursor.exec()
      if (meta === "true") {
        const total = await PemesananModel.countDocuments(match)
        return res.status(200).json({
          data: docs,
          meta: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
        })
      }
      return res.status(200).json(docs)
    }

    // AGGREGATION MODE (join user & jadwal)
    const pipeline = []
    if (Object.keys(match).length) pipeline.push({ $match: match })

    // Lookups
    pipeline.push(
      {
        $lookup: {
          from: "users",
          localField: "user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: { path: "$user", preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: "jadwals",
          localField: "jadwal",
          foreignField: "_id",
          as: "jadwal",
        },
      },
      { $unwind: { path: "$jadwal", preserveNullAndEmptyArrays: true } }
    )

    // Projection - flatten fields untuk kompatibilitas frontend
    pipeline.push({
      $project: {
        kode_booking: 1,
        status: 1,
        status_pembayaran: 1,
        tanggal_pesan: 1,
        jumlah_penumpang: 1,
        nomor_kursi: 1,
        total_harga: 1,
        createdAt: 1,
        updatedAt: 1,
        // Flatten user
        user: {
          _id: "$user._id",
          namaLengkap: "$user.nama",
          email: "$user.email",
          noHp: "$user.no_hp",
        },
        // Flatten jadwal
        jadwal: {
          _id: "$jadwal._id",
          rute_awal: "$jadwal.rute_awal",
          rute_tujuan: "$jadwal.rute_tujuan",
          jam_berangkat: "$jadwal.jam_berangkat",
          harga: "$jadwal.harga",
        },
      },
    })

    // Sorting
    pipeline.push({ $sort: sortObj })
    // Pagination
    pipeline.push({ $skip: skipNum }, { $limit: limitNum })

    let data = await PemesananModel.aggregate(pipeline)

    if (meta === "true") {
      // Hitung total (tanpa skip & limit & sort) -> but keep match & lookups minimal for count
      const countPipeline = []
      if (Object.keys(match).length) countPipeline.push({ $match: match })
      countPipeline.push({ $count: "total" })
      const countRes = await PemesananModel.aggregate(countPipeline)
      const total = countRes.length ? countRes[0].total : 0
      return res.status(200).json({ data, meta: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) } })
    }

    return res.status(200).json(data)
  } catch (error) {
    console.error("Error mengambil data pemesanan (aggregation/find):", error)
    res.status(500).json({ message: "Internal server error, tidak bisa mengambil data pemesanan", details: error.message })
  }
}

// GET /pemesanan/:id - by ObjectId or kode_booking
const getPemesananById = async (req, res) => {
  try {
    const id = req.params.id
    let doc
    if (mongoose.Types.ObjectId.isValid(id)) {
      doc = await PemesananModel.findById(id)
    } else {
      doc = await PemesananModel.findOne({ kode_booking: id })
    }
    if (!doc) return res.status(404).json({ message: "Pemesanan tidak ditemukan" })
    res.status(200).json(doc)
  } catch (error) {
    console.error("Error mengambil pemesanan by id:", error)
    res.status(500).json({ message: "Internal server error", details: error.message })
  }
}

// POST /pemesanan
const createPemesanan = async (req, res) => {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    return res.status(400).json({ errors: result.array() })
  }
  try {
    const { id, user, jadwal, seats, nomor_kursi, totalPrice } = req.body

    const payload = {
      id: id || undefined, // Custom ID (optional)
      user,
      jadwal,
      seats,
      nomor_kursi,
      totalPrice,
      bookingDate: new Date(),
      status: "pending",
    }

    // Fetch user data for snapshot
    if (user) {
      try {
        const UserModel = require("../models/User")
        const userDoc = await UserModel.findById(user)
        if (userDoc) {
          payload.userId = userDoc.id || String(userDoc._id)
          payload.userName = userDoc.namaLengkap || userDoc.nama
          payload.userEmail = userDoc.email
          payload.userPhone = userDoc.noHp || userDoc.no_hp
        } else {
          console.warn("User not found for ObjectId:", user)
        }
      } catch (err) {
        console.error("❌ Failed to fetch user:", err.message)
      }
    }

    // Fetch jadwal data for snapshot
    if (jadwal) {
      try {
        const JadwalModel = require("../models/Jadwal")
        const jadwalDoc = await JadwalModel.findById(jadwal)
        if (jadwalDoc) {
          payload.scheduleId = jadwalDoc.id || String(jadwalDoc._id)
          payload.origin = jadwalDoc.origin || jadwalDoc.rute_awal
          payload.destination = jadwalDoc.destination || jadwalDoc.rute_tujuan
          payload.price = jadwalDoc.price || jadwalDoc.harga

          const dateField = jadwalDoc.date || jadwalDoc.tanggal_keberangkatan || jadwalDoc.jam_berangkat
          const timeField = jadwalDoc.time || jadwalDoc.waktu_keberangkatan

          if (dateField) {
            const date = new Date(dateField)
            if (!isNaN(date.getTime())) {
              payload.date = date.toISOString().split("T")[0]
              if (!timeField) {
                const hours = String(date.getHours()).padStart(2, "0")
                const minutes = String(date.getMinutes()).padStart(2, "0")
                payload.time = `${hours}:${minutes}`
              }
            }
          }

          if (timeField) {
            if (typeof timeField === "string") {
              const [hours, minutes] = timeField.split(":")
              payload.time = `${hours.padStart(2, "0")}:${minutes.padStart(2, "0")}`
            } else if (timeField instanceof Date) {
              const hours = String(timeField.getHours()).padStart(2, "0")
              const minutes = String(timeField.getMinutes()).padStart(2, "0")
              payload.time = `${hours}:${minutes}`
            }
          }
        } else {
          console.warn("Jadwal not found for ObjectId:", jadwal)
        }
      } catch (err) {
        console.error("❌ Failed to fetch jadwal:", err.message)
      }
    }

    const saved = await new PemesananModel(payload).save()
    res.status(201).json(saved)
  } catch (error) {
    console.error("❌ Error membuat pemesanan:", error)
    res.status(500).json({ message: "Internal server error, tidak bisa membuat pemesanan", details: error.message })
  }
}

// PATCH /pemesanan/:id
const updatePemesanan = async (req, res) => {
  const idParam = req.params.id
  const updates = { ...req.body }
  try {
    let updated
    if (mongoose.Types.ObjectId.isValid(idParam)) {
      updated = await PemesananModel.findByIdAndUpdate(idParam, updates, { new: true, runValidators: true })
    } else {
      updated = await PemesananModel.findOneAndUpdate({ kode_booking: idParam }, updates, { new: true, runValidators: true })
    }
    if (!updated) return res.status(404).json({ message: "Pemesanan tidak ditemukan" })
    res.status(200).json(updated)
  } catch (error) {
    console.error("Error update pemesanan:", error)
    res.status(500).json({ message: "Internal server error, tidak bisa update pemesanan", details: error.message })
  }
}

// DELETE /pemesanan/:id
const deletePemesanan = async (req, res) => {
  const idParam = req.params.id
  try {
    let deleted
    if (mongoose.Types.ObjectId.isValid(idParam)) {
      deleted = await PemesananModel.findByIdAndDelete(idParam)
    } else {
      deleted = await PemesananModel.findOneAndDelete({ kode_booking: idParam })
    }
    if (!deleted) return res.status(404).json({ message: "Pemesanan tidak ditemukan" })
    res.status(204).send()
  } catch (error) {
    console.error("Error delete pemesanan:", error)
    res.status(500).json({ message: "Internal server error, tidak bisa delete pemesanan", details: error.message })
  }
}

// PATCH /pemesanan/:id/status
const updatePaymentStatus = async (req, res) => {
  const idParam = req.params.id
  const { status_pembayaran, status } = req.body
  if (!status_pembayaran && !status) {
    return res.status(400).json({ message: "status_pembayaran or status required" })
  }
  try {
    const updates = {}
    if (status_pembayaran) updates.status_pembayaran = status_pembayaran
    if (status) updates.status = status
    let updated
    if (mongoose.Types.ObjectId.isValid(idParam)) {
      updated = await PemesananModel.findByIdAndUpdate(idParam, updates, { new: true, runValidators: true })
    } else {
      updated = await PemesananModel.findOneAndUpdate({ kode_booking: idParam }, updates, { new: true, runValidators: true })
    }
    if (!updated) return res.status(404).json({ message: "Pemesanan tidak ditemukan" })
    res.status(200).json(updated)
  } catch (error) {
    console.error("Error updating payment/status pemesanan:", error)
    res.status(500).json({ message: "Internal server error", details: error.message })
  }
}

// Convenience endpoints
const confirmPemesanan = async (req, res) => {
  const idParam = req.params.id
  console.log("[confirmPemesanan] Called with ID:", idParam)
  try {
    const updates = { status_pembayaran: "success", status: "confirmed" }
    console.log("[confirmPemesanan] Updates:", updates)

    let updated
    if (mongoose.Types.ObjectId.isValid(idParam)) {
      console.log("[confirmPemesanan] Using ObjectId query")
      updated = await PemesananModel.findByIdAndUpdate(idParam, updates, { new: true, runValidators: true })
    } else {
      console.log("[confirmPemesanan] Using kode_booking query")
      updated = await PemesananModel.findOneAndUpdate({ kode_booking: idParam }, updates, { new: true, runValidators: true })
    }

    console.log("[confirmPemesanan] Updated document:", updated)

    if (!updated) {
      console.log("[confirmPemesanan] ❌ Document not found")
      return res.status(404).json({ message: "Pemesanan tidak ditemukan" })
    }

    console.log("[confirmPemesanan] ✅ Success")
    res.status(200).json(updated)
  } catch (error) {
    console.error("[confirmPemesanan] ❌ Error:", error)
    res.status(500).json({ message: "Internal server error", details: error.message })
  }
}

const cancelPemesanan = async (req, res) => {
  const idParam = req.params.id
  console.log("[cancelPemesanan] Called with ID:", idParam)
  try {
    const updates = { status_pembayaran: "cancelled", status: "cancelled" }
    console.log("[cancelPemesanan] Updates:", updates)

    let updated
    if (mongoose.Types.ObjectId.isValid(idParam)) {
      console.log("[cancelPemesanan] Using ObjectId query")
      updated = await PemesananModel.findByIdAndUpdate(idParam, updates, { new: true, runValidators: true })
    } else {
      console.log("[cancelPemesanan] Using kode_booking query")
      updated = await PemesananModel.findOneAndUpdate({ kode_booking: idParam }, updates, { new: true, runValidators: true })
    }

    console.log("[cancelPemesanan] Updated document:", updated)

    if (!updated) {
      console.log("[cancelPemesanan] ❌ Document not found")
      return res.status(404).json({ message: "Pemesanan tidak ditemukan" })
    }

    console.log("[cancelPemesanan] ✅ Success")
    res.status(200).json(updated)
  } catch (error) {
    console.error("[cancelPemesanan] ❌ Error:", error)
    res.status(500).json({ message: "Internal server error", details: error.message })
  }
}

const completePemesanan = async (req, res) => {
  const idParam = req.params.id
  console.log("[completePemesanan] Called with ID:", idParam)
  try {
    const updates = { status_pembayaran: "success", status: "completed" }
    console.log("[completePemesanan] Updates:", updates)

    let updated
    if (mongoose.Types.ObjectId.isValid(idParam)) {
      console.log("[completePemesanan] Using ObjectId query")
      updated = await PemesananModel.findByIdAndUpdate(idParam, updates, { new: true, runValidators: true })
    } else {
      console.log("[completePemesanan] Using kode_booking query")
      updated = await PemesananModel.findOneAndUpdate({ kode_booking: idParam }, updates, { new: true, runValidators: true })
    }

    console.log("[completePemesanan] Updated document:", updated)

    if (!updated) {
      console.log("[completePemesanan] ❌ Document not found")
      return res.status(404).json({ message: "Pemesanan tidak ditemukan" })
    }

    console.log("[completePemesanan] ✅ Success")
    res.status(200).json(updated)
  } catch (error) {
    console.error("[completePemesanan] ❌ Error:", error)
    res.status(500).json({ message: "Internal server error", details: error.message })
  }
}

module.exports = {
  getPemesanan,
  getPemesananById,
  createPemesanan,
  updatePemesanan,
  deletePemesanan,
  updatePaymentStatus,
  confirmPemesanan,
  cancelPemesanan,
  completePemesanan,
}
