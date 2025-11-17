// File Controller jadwal
// Kasyful Haq Bachariputra
// 17 November 2025

const model = require('../models/Jadwal');

const getJadwal = async (req, res) => {
    // 1. Logic to extract data from req (e.g., req.query)
    const rute_awal = req.query.rute_awal;
    const rute_tujuan = req.query.rute_tujuan;
    const jam_berangkat = req.query.jam_berangkat;

    // 2. Logic to talk to the database (e.g., Model.find())
    const jadwal = await model.find({
        rute_awal: rute_awal,
        rute_tujuan: rute_tujuan,
        jam_berangkat: jam_berangkat
    });

    // 3. Logic to send the response (e.g., res.json() or res.status())
    res.json(jadwal);
};

module.exports = { getJadwal };

