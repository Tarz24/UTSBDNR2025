// File Controller jadwal
// Kasyful Haq Bachariputra
// 17 November 2025

const { body, validationResult } = require('express-validator');
const JadwalModel = require('../models/Jadwal');

const getJadwal = async (req, res) => {
    // 1. Logic to extract data from req
    const rute_awal = req.query.rute_awal;
    const rute_tujuan = req.query.rute_tujuan;
    const jam_berangkat = req.query.jam_berangkat;

    // 2. Logic to talk to the database
    const jadwal = await JadwalModel.find({
        rute_awal: rute_awal,
        rute_tujuan: rute_tujuan,
        jam_berangkat: jam_berangkat
    });

    // 3. Logic to send the response
    res.json(jadwal);
};

const createJadwal = async (req, res) => {
    // Ambil hasil validasi dari request yang masuk
    const result = validationResult(req);

    // bila tidak error, lakukan instansiasi model dan penyimpanan ke database
    if (result.isEmpty()){
        try{
            const newJadwalDoc = new JadwalModel(req.body);

            const savedJadwal = await newJadwalDoc.save();

            res.status(201).json(savedJadwal);
        }catch (error) {
            console.error("Error membuat jadwal:", error);
            res.status(500).json({
                message: "Internal server error, tidak bisa save jadwal",
                details: error.message
            });
        }
    }
    // apabila error, kirim status yang sesuai
    else{
        res.status(400).send({ errors: result.array() });
    }
}

const updateJadwal = async (req, res) => {
    // Ekstraksi dari id
    const id = req.params.id;
    const update_data = req.body;

    try{
        const updatedDocument = await JadwalModel.findByIdAndUpdate(
            id, update_data, { new: true, runValidators: true }
        );

        if(updatedDocument){
            res.status(200).json(updatedDocument);
        }else{
            res(404).json({ message: "Jadwal tidak ditemukan" });
        }
    }catch(error){
        console.error("Error mmengubah jadwal:", error);
        res.status(500).json({
            message: "Internal server error, tidak bisa ubah jadwal",
            details: error.message
        });
    }

}

module.exports = { getJadwal, createJadwal, updateJadwal };

