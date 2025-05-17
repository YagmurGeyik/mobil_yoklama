// routes/auth.js
const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/login', (req, res) => {
    const { email, sifre } = req.body;
    const sql = "SELECT * FROM ogretmenler WHERE email = ? AND sifre = ?";
    db.query(sql, [email, sifre], (err, results) => {
        if (err) {
            res.status(500).json({ error: "Sunucu hatası!" });
        } else if (results.length > 0) {
            res.status(200).json({ message: "Giriş başarılı!", ogretmen: results[0] });
        } else {
            res.status(401).json({ error: "E-posta veya şifre hatalı!" });
        }
    });
});

module.exports = router;
