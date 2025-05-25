const express = require("express");
const router = express.Router();

const mysql = require("mysql2/promise");
const dbPool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "yag0309ik",
  database: "online_yoklama",
  charset: "utf8mb4" 
});

// Tüm öğrencileri döndür (ad ve soyad ayrı ayrı döner)
router.get("/", async (req, res) => {
  try {
    await dbPool.query("SET NAMES utf8mb4 COLLATE utf8mb4_turkish_ci"); // Türkçe karakter için garanti

    const [results] = await dbPool.query("SELECT id, ad, soyad FROM ogrenciler WHERE aktif_durum = 1");

    // Öğrenci listesini doğrudan döndür
    const students = results.map((ogr) => ({
      id: ogr.id,
      ad: ogr.ad,
      soyad: ogr.soyad,
    }));

    res.json(students);
  } catch (err) {
    console.error("Kullanıcılar alınamadı:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});

module.exports = router;
