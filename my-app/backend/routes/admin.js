const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2/promise");

const SECRET_KEY = "gizliAnahtar";

const dbPool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "yag0309ik",
  database: "online_yoklama",
});

// 🔐 Yetki kontrolü middleware
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Yetki yok" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    if (decoded.yetki !== "dekan") {
      return res.status(403).json({ error: "Bu alana sadece dekan erişebilir" });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Geçersiz veya süresi dolmuş token" });
  }
};

// Tüm admin rotalarına middleware uygula
router.use(authMiddleware);

// 👨‍🏫 Öğretmenleri Listele
router.get("/ogretmenler", async (req, res) => {
  try {
    const [results] = await dbPool.query("SELECT id, ad_soyad, email, yetki FROM ogretmenler");
    return res.json(results);
  } catch (err) {
    console.error("DB Hatası:", err);
    return res.status(500).json({ error: err.message });
  }
});

// 👨‍🎓 Öğrencileri Listele
router.get("/ogrenciler", async (req, res) => {
  try {
    const [results] = await dbPool.query("SELECT id, ad_soyad, ogrenci_no, sinif FROM ogrenciler");
    return res.json(results);
  } catch (err) {
    console.error("DB Hatası:", err);
    return res.status(500).json({ error: err.message });
  }
});

// 👨‍🏫 Öğretmen Ekle
router.post(
  "/ogretmenler",
  [
    body("ad_soyad").notEmpty().withMessage("Ad soyad zorunludur"),
    body("email").isEmail().withMessage("Geçerli bir e-posta giriniz"),
    body("sifre").isLength({ min: 6 }).withMessage("Şifre en az 6 karakter olmalıdır"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { ad_soyad, email, sifre, yetki } = req.body;

      // Email kontrolü
      const [existing] = await dbPool.query("SELECT * FROM ogretmenler WHERE email = ?", [email]);
      if (existing.length > 0) {
        return res.status(400).json({ error: "Bu email zaten kullanımda" });
      }

      const hashedPassword = await bcrypt.hash(sifre, 10);
      const [result] = await dbPool.query(
        "INSERT INTO ogretmenler (ad_soyad, email, sifre, yetki) VALUES (?, ?, ?, ?)",
        [ad_soyad, email, hashedPassword, yetki || "ogretmen"]
      );

      return res.status(201).json({ message: "Öğretmen başarıyla eklendi.", id: result.insertId });
    } catch (err) {
      console.error("Öğretmen Ekleme Hatası:", err);
      return res.status(500).json({ error: err.message });
    }
  }
);

// 👨‍🎓 Öğrenci Ekle
router.post(
  "/ogrenciler",
  [
    body("ad_soyad").notEmpty().withMessage("Ad soyad zorunludur"),
    body("ogrenci_no").isNumeric().withMessage("Öğrenci numarası sayısal olmalıdır"),
    body("sinif").notEmpty().withMessage("Sınıf bilgisi zorunludur"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { ad_soyad, ogrenci_no, sinif } = req.body;

      // Öğrenci no kontrolü
      const [existing] = await dbPool.query("SELECT * FROM ogrenciler WHERE ogrenci_no = ?", [ogrenci_no]);
      if (existing.length > 0) {
        return res.status(400).json({ error: "Bu öğrenci numarası zaten kullanımda" });
      }

      const [result] = await dbPool.query(
        "INSERT INTO ogrenciler (ad_soyad, ogrenci_no, sinif) VALUES (?, ?, ?)",
        [ad_soyad, ogrenci_no, sinif]
      );

      return res.status(201).json({ message: "Öğrenci başarıyla eklendi.", id: result.insertId });
    } catch (err) {
      console.error("Öğrenci Ekleme Hatası:", err);
      return res.status(500).json({ error: err.message });
    }
  }
);

// 🗑️ Öğretmen Sil
router.delete("/ogretmenler/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await dbPool.query("DELETE FROM ogretmenler WHERE id = ?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Öğretmen bulunamadı." });
    return res.status(204).send();
  } catch (err) {
    console.error("Öğretmen Silme Hatası:", err);
    return res.status(500).json({ error: err.message });
  }
});

// 🗑️ Öğrenci Sil
router.delete("/ogrenciler/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await dbPool.query("DELETE FROM ogrenciler WHERE id = ?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Öğrenci bulunamadı." });
    return res.status(204).send();
  } catch (err) {
    console.error("Öğrenci Silme Hatası:", err);
    return res.status(500).json({ error: err.message });
  }
});

module.exports = router;
