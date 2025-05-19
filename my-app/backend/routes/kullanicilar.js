// routes/kullanicilar.js
const express = require("express");
const router = express.Router();
const db = require("../db"); // db.js dosyasını çağır

// GET /api/kullanicilar
router.get("/", (req, res) => {
  const sorgu = "SELECT id, ad, soyad FROM kullanicilar";

  db.query(sorgu, (err, results) => {
    if (err) {
      console.error("Veritabanı hatası:", err);
      return res.status(500).json({ error: "Veri alınamadı" });
    }
    res.json(results);
  });
});

module.exports = router;
