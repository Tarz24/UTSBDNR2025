// File Route jadwal
// Kasyful Haq Bachariputra
// 17 November 2025

const { body } = require('express-validator');
const express = require('express');
const router = require('express').Router();

const { getJadwal, createJadwal } = require('../controllers/jadwalController');

// Route handler untuk model 'jadwal'
// get
router.get('/jadwal', getJadwal);

// post
router.post('/jadwal', body('rute_awal').notEmpty(), body('rute_tujuan').notEmpty(), body('jam_berangkat').isDate().notEmpty(), 
body('pool_keberangkatan').notEmpty(), body('pool_tujuan').notEmpty(), body('estimasi_jam_tiba').isDate().notEmpty(), body('harga').isInt().notEmpty(),
body('total_kursi').isInt().notEmpty(), body('kursi_tersedia').isInt().notEmpty(), createJadwal);

module.exports = router;