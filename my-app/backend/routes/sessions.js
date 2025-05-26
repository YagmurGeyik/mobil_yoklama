const express = require('express');
const router = express.Router();
const db = require('../db');

// SESSION OLUŞTURMA
router.post('/create-session', async (req, res) => {
  try {
    const { sessionId, lesson, timestamp } = req.body;

    const createdAt = new Date(timestamp || new Date());
    const expiresAt = new Date(createdAt.getTime() + 15 * 60 * 1000); // 15 dk sonra

    await db.query(`
      INSERT INTO sessions (sessionId, lesson, createdAt, expiresAt, isActive)
      VALUES (?, ?, ?, ?, 1)
    `, [sessionId, lesson, createdAt, expiresAt]);

    console.log('Session kaydedildi:', { sessionId, lesson });

    res.json({ success: true, message: 'Session başarıyla oluşturuldu', sessionId });

  } catch (error) {
    console.error('Session oluşturma hatası:', error);
    res.status(500).json({ success: false, message: 'Session oluşturulamadı' });
  }
});


// YOKLAMA (ATTENDANCE) KAYDI
router.post('/mark-attendance', async (req, res) => {
  try {
    const { sessionId, lesson, studentName } = req.body;

    // Session kontrolü
    const [sessions] = await db.query(`
      SELECT * FROM sessions 
      WHERE sessionId = ? AND isActive = 1
    `, [sessionId]);

    if (sessions.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Geçersiz veya süresi dolmuş session'
      });
    }

    const session = sessions[0];
    const now = new Date();

    if (new Date(session.expiresAt) < now) {
      // Oturum süresi dolmuşsa isActive = 0 yap
      await db.query(`
        UPDATE sessions SET isActive = 0 WHERE id = ?
      `, [session.id]);

      return res.status(410).json({ 
        success: false, 
        message: 'Session süresi dolmuş (15 dakika)' 
      });
    }

    if (session.lesson !== lesson) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ders bilgisi eşleşmiyor' 
      });
    }

    // Aynı gün aynı öğrenci yoklama vermiş mi?
    const [existing] = await db.query(`
      SELECT id FROM attendance 
      WHERE studentName = ? AND lesson = ? AND DATE(timestamp) = CURDATE()
    `, [studentName, lesson]);

    if (existing.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Bu ders için bugün zaten yoklama verilmiş' 
      });
    }

    // Yoklamayı kaydet
    await db.query(`
      INSERT INTO attendance (studentName, lesson, timestamp)
      VALUES (?, ?, NOW())
    `, [studentName, lesson]);

    // Öğrenciyi aktif yap
    await db.query(`
      UPDATE ogrenciler SET aktif_durum = 1 
      WHERE CONCAT(ad, ' ', soyad) = ?
    `, [studentName]);

    // Aktif öğrencileri al ve socket ile gönder
    const [activeStudents] = await db.query(`
      SELECT id, ad, soyad FROM ogrenciler WHERE aktif_durum = 1
    `);

    if (global.io) {
      global.io.emit("online-kullanicilar", activeStudents);
    }

    res.json({
      success: true,
      message: 'Yoklama başarıyla kaydedildi',
      student: studentName
    });

  } catch (error) {
    console.error('Yoklama kaydetme hatası:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});


// AKTİF SESSION LİSTESİ (opsiyonel debug endpoint)
router.get('/sessions', async (req, res) => {
  try {
    const [sessions] = await db.query(`
      SELECT * FROM sessions 
      WHERE isActive = 1 AND expiresAt > NOW()
    `);

    res.json({ success: true, sessions });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Veritabanı hatası' });
  }
});

module.exports = router;
