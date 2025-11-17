// File Route jadwal
// Kasyful Haq Bachariputra
// 17 November 2025

const express = require('express');
const router = require('express').Router();

const { getJadwal } = require('../controllers/jadwalController');

// Route handler untuk model 'jadwal'
router.get('/jadwal', getJadwal);

module.exports = router;