const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

const db = require('../db'); // Ortak DB bağlantısı

const SECRET_KEY = "gizliAnahtar";

router.use(express.json());

// Öğretmen Giriş
router.post("/giris", async (req, res) => {
  const { email, sifre } = req.body;

  if (!email || !sifre) {
    return res.status(400).json({ error: "E-posta ve şifre gerekli" });
  }

  try {
    const [results] = await db.query("SELECT * FROM ogretmenler WHERE email = ?", [email]);

    if (results.length === 0) {
      return res.status(401).json({ error: "Kullanıcı bulunamadı!" });
    }

    const ogretmen = results[0];

    // Şifre karşılaştırması - boşluklardan etkilenmemesi için trim()
    console.log("Girilen şifre:", sifre);
    console.log("Veritabanındaki şifre:", ogretmen.sifre);

    if (sifre.trim() !== String(ogretmen.sifre).trim()) {
      return res.status(401).json({ error: "Şifre yanlış!" });
    }

    const token = jwt.sign(
      {
        id: ogretmen.id,
        ad_soyad: ogretmen.ad_soyad,
        yetki: ogretmen.yetki,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    res.status(200).json({ message: "Giriş başarılı!", token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Sunucu hatası!", details: err.message });
  }
});

module.exports = router;
