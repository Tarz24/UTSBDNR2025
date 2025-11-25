// File Controller jadwal
// Kasyful Haq Bachariputra
// 17 November 2025

const { body, validationResult } = require("express-validator")
const JadwalModel = require("../models/Jadwal")

const getJadwal = async (req, res) => {
  try {
    // Ambil data berdasarkan filter yang ada
    const filter = req.query // Default adalah object kosong untuk mengambil semua data

    // Kirim query untuk semua document yang sesuai dengan filter
    const semuaJadwal = await JadwalModel.find(filter)

    // Kirim response dalam bentuk json
    res.status(200).json(semuaJadwal)
  } catch (error) {
    console.error("Error mengambil data jadwal:", error)
    res.status(500).json({
      message: "Internal server error, tidak bisa mengambil data jadwal.",
      details: error.message,
    })
  }
}

const createJadwal = async (req, res) => {
  // Ambil hasil validasi dari request yang masuk
  const result = validationResult(req)

  // bila tidak error, lakukan instansiasi model dan penyimpanan ke database
  if (result.isEmpty()) {
    try {
      // sanitize and include optional frontend ID if present
      const payload = { ...req.body }
      if (payload.id && typeof payload.id === "string") payload.id = payload.id.trim().toUpperCase()

      const newJadwalDoc = new JadwalModel(payload)

      const savedJadwal = await newJadwalDoc.save()

      res.status(201).json(savedJadwal)
    } catch (error) {
      console.error("Error membuat jadwal:", error)
      res.status(500).json({
        message: "Internal server error, tidak bisa save jadwal",
        details: error.message,
      })
    }
  }
  // apabila error, kirim status yang sesuai
  else {
    res.status(400).send({ errors: result.array() })
  }
}

const updateJadwal = async (req, res) => {
  // Ekstraksi dari id
  const id = req.params.id
  const update_data = req.body
  console.log("updateJadwal called with id=", id, "body=", update_data)

  try {
    // sanitize id field if present in payload
    if (update_data && update_data.id && typeof update_data.id === "string") {
      update_data.id = update_data.id.trim().toUpperCase()
    }

    let updatedDocument
    // if id param looks like MongoDB ObjectId, update by _id, otherwise try updating by custom 'id' field
    if (/^[a-fA-F0-9]{24}$/.test(id)) {
      updatedDocument = await JadwalModel.findByIdAndUpdate(id, update_data, { new: true, runValidators: true })
    } else {
      updatedDocument = await JadwalModel.findOneAndUpdate({ id: id }, update_data, { new: true, runValidators: true })
    }

    if (updatedDocument) {
      res.status(200).json(updatedDocument)
    } else {
      res.status(404).json({ message: "Jadwal tidak ditemukan" })
    }
  } catch (error) {
    console.error("Error mmengubah jadwal:", error)
    res.status(500).json({
      message: "Internal server error, tidak bisa ubah jadwal",
      details: error.message,
    })
  }
}

const deleteJadwal = async (req, res) => {
  const idParameter = req.params.id

  try {
    const deletedDocument = await JadwalModel.findByIdAndDelete(idParameter)

    if (deletedDocument) {
      res.status(204).send()
    } else {
      res.status(404).json({ message: "Jadwal tidak ditemukan" })
    }
  } catch (error) {
    console.error("Error mmengubah jadwal:", error)
    res.status(500).json({
      message: "Internal server error, tidak bisa delete jadwal   ",
      details: error.message,
    })
  }
}

module.exports = { getJadwal, createJadwal, updateJadwal, deleteJadwal }
