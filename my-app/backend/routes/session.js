const express = require('express');
const router = express.Router();
const db = require('../db'); // db bağlantısı burada tanımlı olmalı

// Global activeSessions'ı başlat
if (!global.activeSessions) {
  global.activeSessions = {};
}

// Session oluşturma
router.post('/create-session', async (req, res) => {
  try {
    const { sessionId, lesson, timestamp } = req.body;

    console.log('Yeni session oluşturuluyor:', { sessionId, lesson, timestamp });

    // Global activeSessions'ı kontrol et ve oluştur
    if (!global.activeSessions) {
      global.activeSessions = {};
    }

    global.activeSessions[sessionId] = {
      lesson,
      createdAt: timestamp || new Date().toISOString(),
      isActive: true
    };

    console.log('Aktif sessionlar:', Object.keys(global.activeSessions));

    res.json({ 
      success: true, 
      message: 'Session başarıyla oluşturuldu',
      sessionId,
      activeSessions: Object.keys(global.activeSessions) // Debug için
    });
  } catch (error) {
    console.error('Session oluşturma hatası:', error);
    res.status(500).json({ success: false, message: 'Session oluşturulamadı' });
  }
});

// Aktif sessionları listeleme (debug için)
router.get('/active-sessions', (req, res) => {
  res.json({
    success: true,
    activeSessions: global.activeSessions || {},
    count: Object.keys(global.activeSessions || {}).length
  });
});

// QR kod okutulduğunda yoklama kaydetme ve socket ile frontend'e gönderme
router.post('/mark-attendance', async (req, res) => {
  try {
    const { sessionId, lesson, studentName } = req.body;

    console.log('Yoklama isteği:', { sessionId, lesson, studentName });
    console.log('Mevcut aktif sessionlar:', global.activeSessions);

    // Global activeSessions kontrolü
    if (!global.activeSessions) {
      console.log('Global activeSessions bulunamadı');
      return res.status(400).json({ 
        success: false, 
        message: 'Sistem hatası: Session yöneticisi başlatılmamış' 
      });
    }

    // Session geçerli mi kontrol et
    const session = global.activeSessions[sessionId];
    if (!session) {
      console.log('Session bulunamadı:', sessionId);
      console.log('Mevcut sessionlar:', Object.keys(global.activeSessions));
      return res.status(400).json({ 
        success: false, 
        message: 'Geçersiz veya süresi dolmuş session',
        availableSessions: Object.keys(global.activeSessions) // Debug için
      });
    }

    // Session süre kontrolü (15 dakika)
    const sessionAge = Date.now() - new Date(session.createdAt).getTime();
    if (sessionAge > 15 * 60 * 1000) {
      console.log('Session süresi dolmuş:', sessionId, 'Yaş:', sessionAge / 1000 / 60, 'dakika');
      delete global.activeSessions[sessionId];
      return res.status(410).json({ 
        success: false, 
        message: 'Session süresi dolmuş (15 dakika)' 
      });
    }

    // Ders bilgisi eşleşiyor mu?
    if (session.lesson !== lesson) {
      console.log('Ders bilgisi eşleşmiyor:', session.lesson, '!=', lesson);
      return res.status(400).json({ 
        success: false, 
        message: 'Ders bilgisi eşleşmiyor' 
      });
    }

    // Aynı gün aynı derse yoklama verilmiş mi?
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

    // Yoklama kaydet
    await db.query(`
      INSERT INTO attendance (studentName, lesson, timestamp)
      VALUES (?, ?, NOW())
    `, [studentName, lesson]);

    // Öğrenciyi aktif yap
    await db.query(`
      UPDATE ogrenciler
      SET aktif_durum = 1
      WHERE CONCAT(ad, ' ', soyad) = ?
    `, [studentName]);

    // Güncel aktif öğrencileri al
    const [activeStudents] = await db.query(`
      SELECT id, ad, soyad FROM ogrenciler WHERE aktif_durum = 1
    `);

    // Socket ile frontend'e gönder
    if (global.io) {
      global.io.emit("online-kullanicilar", activeStudents);
    }

    console.log('Yoklama başarıyla kaydedildi:', { studentName, lesson });

    res.json({ 
      success: true, 
      message: 'Yoklama başarıyla kaydedildi',
      lesson,
      student: studentName 
    });

  } catch (error) {
    console.error('Yoklama kaydetme hatası:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Yoklama kaydedilemedi: ' + error.message 
    });
  }
});

// Aktif sessionları temizle (her dakika kontrol et, 15 dakikada eskiyi sil)
const cleanup = () => {
  if (!global.activeSessions) {
    global.activeSessions = {};
    return;
  }

  const now = Date.now();
  const beforeCount = Object.keys(global.activeSessions).length;
  
  Object.entries(global.activeSessions).forEach(([id, session]) => {
    const age = now - new Date(session.createdAt).getTime();
    if (age > 15 * 60 * 1000) { // 15 dakika
      console.log('Eski session temizleniyor:', id);
      delete global.activeSessions[id];
    }
  });

  const afterCount = Object.keys(global.activeSessions).length;
  if (beforeCount !== afterCount) {
  console.log(`Session temizliği: ${beforeCount} -> ${afterCount}`);
  }
};

// Temizlik işlemini başlat
setInterval(cleanup, 60 * 1000); // Her dakika

module.exports = router;