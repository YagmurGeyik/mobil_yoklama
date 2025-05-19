const express = require('express');
const app = express();
const mysql = require('mysql2');

// DB bağlantısı
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'yag0309ik',
  database: 'online_yoklama'
});

// Body verisini alabilmek için gerekli middleware
app.use(express.json());

app.post('/api/giris', async (req, res) => {
  const { email, sifre } = req.body;

  if (!email || !sifre) {
    return res.status(400).json({ error: 'E-posta ve şifre gerekli' });
  }

  try {
    const [results] = await db.promise().query('SELECT * FROM ogretmenler WHERE email = ?', [email]);

    if (results.length === 0) {
      return res.status(401).json({ error: 'Kullanıcı bulunamadı!' });
    }

    const ogretmen = results[0];

    if (ogretmen.sifre !== sifre) {
      return res.status(401).json({ error: 'Şifre yanlış!' });
    }

    res.status(200).json({
      message: 'Giriş başarılı!',
      ogretmen: {
        id: ogretmen.id,
        ad_soyad: ogretmen.ad_soyad,
        yetki: ogretmen.yetki,
      },
    });
  } catch (err) {
    res.status(500).json({ error: 'Sunucu hatası!', details: err.message });
  }
});
