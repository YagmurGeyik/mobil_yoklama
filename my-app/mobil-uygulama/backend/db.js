// db.js
const mysql = require('mysql');

const db = mysql.createConnection({
  host: "localhost",      // Veritabanı sunucu adresi
  user: "root",           // MySQL kullanıcı adın
  password: "yag0309ik",           // MySQL şifren
  database: "online_yoklama" // Veritabanı ismin
});

db.connect((err) => {
  if (err) {
    console.error("Veritabanı bağlantı hatası:", err);
    return;
  }
  console.log("MySQL bağlantısı başarılı!");
});

module.exports = db;
