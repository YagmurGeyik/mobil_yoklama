const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const { body, validationResult } = require("express-validator");

const mysql = require("mysql2/promise");
const dbPool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "yag0309ik",
  database: "online_yoklama",
});

// Auth middleware - bu middleware'i routes/auth.js'den içe aktarmanız gerekebilir
// Bu örnek bir authentication middleware'dir, gerçek projenize göre değiştirin
const authMiddleware = async (req, res, next) => {
  // Eğer bir auth token sisteminiz varsa kontrol edin
  // Token yoksa veya geçersizse:
  // return res.status(401).json({ error: "Yetkisiz erişim" });
  
  // Örnek olarak şimdilik tüm isteklere izin verelim
  next();
};

// Tüm admin rotalarına auth middleware ekle
router.use(authMiddleware);

// Öğretmenleri listele
router.get("/ogretmenler", async (req, res) => {
  try {
    const [results] = await dbPool.query("SELECT id, ad_soyad, email, yetki FROM ogretmenler");
    res.json(results);
  } catch (err) {
    console.error("DB Hatası:", err);
    res.status(500).json({ error: err.message });
  }
});

// Öğrencileri listele
router.get("/ogrenciler", async (req, res) => {
  try {
    const [results] = await dbPool.query("SELECT id, ad_soyad, ogrenci_no, sinif FROM ogrenciler");
    res.json(results);
  } catch (err) {
    console.error("DB Hatası:", err);
    res.status(500).json({ error: err.message });
  }
});

// Öğretmen ekle
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
      // Önce email'in mevcut olup olmadığını kontrol et
      const [existingUsers] = await dbPool.query(
        "SELECT * FROM ogretmenler WHERE email = ?",
        [req.body.email]
      );
      
      if (existingUsers.length > 0) {
        return res.status(400).json({ error: "Bu email zaten kullanımda" });
      }
      
      const { ad_soyad, email, sifre, yetki } = req.body;
      const hashedPassword = await bcrypt.hash(sifre, 10);
      const [result] = await dbPool.query(
        "INSERT INTO ogretmenler (ad_soyad, email, sifre, yetki) VALUES (?, ?, ?, ?)",
        [ad_soyad, email, hashedPassword, yetki || "ogretmen"]
      );
      res.status(201).json({ message: "Öğretmen başarıyla eklendi.", id: result.insertId });
    } catch (err) {
      console.error("Öğretmen Ekleme Hatası:", err);
      res.status(500).json({ error: "Öğretmen eklenemedi: " + err.message });
    }
  }
);

// Öğrenci ekle
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
      // Önce öğrenci numarasının benzersiz olup olmadığını kontrol et
      const [existingStudents] = await dbPool.query(
        "SELECT * FROM ogrenciler WHERE ogrenci_no = ?",
        [req.body.ogrenci_no]
      );
      
      if (existingStudents.length > 0) {
        return res.status(400).json({ error: "Bu öğrenci numarası zaten kullanımda" });
      }
      
      const { ad_soyad, ogrenci_no, sinif } = req.body;
      const [result] = await dbPool.query(
        "INSERT INTO ogrenciler (ad_soyad, ogrenci_no, sinif) VALUES (?, ?, ?)",
        [ad_soyad, ogrenci_no, sinif]
      );
      res.status(201).json({ message: "Öğrenci başarıyla eklendi.", id: result.insertId });
    } catch (err) {
      console.error("Öğrenci Ekleme Hatası:", err);
      res.status(500).json({ error: "Öğrenci eklenemedi: " + err.message });
    }
  }
);

// Öğretmen sil
router.delete("/ogretmenler/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await dbPool.query("DELETE FROM ogretmenler WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Öğretmen bulunamadı." });
    res.status(204).send();
  } catch (err) {
    console.error("Öğretmen Silme Hatası:", err);
    res.status(500).json({ error: err.message });
  }
});

// Öğrenci sil
router.delete("/ogrenciler/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await dbPool.query("DELETE FROM ogrenciler WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: "Öğrenci bulunamadı." });
    res.status(204).send();
  } catch (err) {
    console.error("Öğrenci Silme Hatası:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router; 