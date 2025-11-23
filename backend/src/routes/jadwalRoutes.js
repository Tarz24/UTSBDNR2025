// File Route jadwal
// Kasyful Haq Bachariputra
// 17 November 2025

const { body } = require('express-validator');
const express = require('express');
const router = require('express').Router();

const { getJadwal, createJadwal, updateJadwal } = require('../controllers/jadwalController');

// Route handler untuk model 'jadwal'
// get / read
router.get('/jadwal', getJadwal);

// post / create
router.post('/jadwal', body('rute_awal').notEmpty(), body('rute_tujuan').notEmpty(), body('jam_berangkat').isDate().notEmpty(), 
body('pool_keberangkatan').notEmpty(), body('pool_tujuan').notEmpty(), body('estimasi_jam_tiba').isDate().notEmpty(), body('harga').isInt().notEmpty(),
body('total_kursi').isInt().notEmpty(), body('kursi_tersedia').isInt().notEmpty(), createJadwal);

// patch / update
router.patch('/jadwal/:id', updateJadwal);

module.exports = router;