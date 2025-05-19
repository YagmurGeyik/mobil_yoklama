/*const mysql = require('mysql2/promise'); // Promise tabanlı modül
require('dotenv').config();

const db = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

db.getConnection()
  .then(() => console.log('Veritabanı bağlantısı başarılı!'))
  .catch(err => console.error('Veritabanına bağlanırken hata oluştu:', err.message));

module.exports = db;*/
// db.js
const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",       // MySQL kullanıcı adın
  password: "yag0309ik",           // MySQL şifren
  database: "online_yoklama",   // Kullanacağın veritabanı adı
});

connection.connect((err) => {
  if (err) {
    console.error("MySQL bağlantı hatası:", err);
    return;
  }
  console.log("✅ MySQL veritabanına bağlanıldı.");
});

module.exports = connection;
