const mysql = require('mysql2/promise');

const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'yag0309ik',
  database: process.env.DB_NAME || 'online_yoklama',
  charset: 'utf8mb4_general_ci' // ← BU SATIRI EKLE
});

db.getConnection()
  .then(() => console.log('Veritabanı bağlantısı başarılı!'))
  .catch(err => console.error('Veritabanına bağlanırken hata oluştu:', err.message));

module.exports = db;
