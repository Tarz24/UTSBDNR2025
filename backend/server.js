// File untuk menjalankan server Express
// Kasyful Haq B.
// 17 November 2025

require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const jadwalRouter = require('./src/routes/jadwalRoutes');
const port = 3000;

const MONGODB_URL = process.env.MONGODB_URL;

app.use('/api', jadwalRouter);

mongoose.connect(MONGODB_URL)
    .then(() => {
        console.log('✅ MongoDB Connected Successfully!');
        
        // ONLY START THE SERVER AFTER THE DB IS CONNECTED
        app.listen(port, () => {
            console.log(`Example app listening at http://localhost:${port}`);
        });
    })
    .catch((err) => {
        console.error('❌ MongoDB connection error:', err.message);
        // Optionally, exit the process if the connection fails
        process.exit(1); 
    });
