const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");

const db = require("../db");
const SECRET_KEY = "gizliAnahtar";

// Yetki kontrolü middleware
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

router.use(authMiddleware);

// Öğretmenleri Listele
router.get("/ogretmenler", async (req, res) => {
  try {
    const [results] = await db.query("SELECT id, ad_soyad, email, yetki FROM ogretmenler");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Öğrencileri Listele
router.get("/ogrenciler", async (req, res) => {
  try {
    const [results] = await db.query("SELECT id, ad, soyad, email, studentNumber, aktif_durum FROM ogrenciler");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Öğretmen Ekle
router.post(
  "/ogretmenler",
  [
    body("ad_soyad").notEmpty().withMessage("Ad soyad zorunludur"),
    body("email").isEmail().withMessage("Geçerli bir e-posta giriniz"),
    body("sifre").isLength({ min: 2 }).withMessage("Şifre en az 2 karakter olmalıdır"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { ad_soyad, email, sifre, yetki } = req.body;

      const [existing] = await db.query("SELECT * FROM ogretmenler WHERE email = ?", [email]);
      if (existing.length > 0) {
        return res.status(400).json({ error: "Bu email zaten kullanımda" });
      }

      const [result] = await db.query(
        "INSERT INTO ogretmenler (ad_soyad, email, sifre, yetki) VALUES (?, ?, ?, ?)",
        [ad_soyad, email, sifre, yetki || "ogretmen"]
      );

      res.status(201).json({ message: "Öğretmen başarıyla eklendi.", id: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Öğrenci Ekle (GÜNCELLENDİ)
router.post(
  "/ogrenciler",
  [
    body("ad").notEmpty().withMessage("Ad zorunludur"),
    body("soyad").notEmpty().withMessage("Soyad zorunludur"),
    body("email").isEmail().withMessage("Geçerli bir e-posta giriniz"),
    body("password").isLength({ min: 2 }).withMessage("Şifre en az 2 karakter olmalıdır"),
    body("studentNumber").isNumeric().withMessage("Öğrenci numarası sayısal olmalıdır"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { ad, soyad, email, password, studentNumber } = req.body;

      const [existing] = await db.query("SELECT * FROM ogrenciler WHERE studentNumber = ?", [studentNumber]);
      if (existing.length > 0) {
        return res.status(400).json({ error: "Bu öğrenci numarası zaten kullanımda" });
      }

      const [result] = await db.query(
        "INSERT INTO ogrenciler (ad, soyad, email, password, aktif_durum, studentNumber) VALUES (?, ?, ?, ?, ?, ?)",
        [ad, soyad, email, password, 0, studentNumber]
      );

      res.status(201).json({ message: "Öğrenci başarıyla eklendi.", id: result.insertId });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// Öğretmen Sil
router.delete("/ogretmenler/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM ogretmenler WHERE id = ?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Öğretmen bulunamadı." });
    return res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Öğrenci Sil
router.delete("/ogrenciler/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query("DELETE FROM ogrenciler WHERE id = ?", [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ error: "Öğrenci bulunamadı." });
    return res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 