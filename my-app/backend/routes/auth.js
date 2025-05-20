const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const mysql = require('mysql2');

const SECRET_KEY = "gizliAnahtar";

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'yag0309ik',
  database: 'online_yoklama',
});

router.use(express.json());
// login.js (auth router)

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

    // bcrypt ile şifre karşılaştırma
    const sifreDogruMu = await bcrypt.compare(sifre, ogretmen.sifre);
    if (!sifreDogruMu) {
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
