// backend/index.js

const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const http = require("http");
const socketIO = require("socket.io");
const authRoutes = require('./routes/auth');     // ✔️ Auth route bağlandı
const adminRoutes = require('./routes/admin');   // ✔️ Admin route bağlandı

const app = express();
app.use(cors());
app.use(express.json());

// ✔️ MySQL Bağlantısı
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'yag0309ik',
  database: 'online_yoklama'
});

// ✔️ Veritabanı Bağlantı Kontrolü
db.connect((err) => {
  if (err) {
    console.error('❌ Veritabanına bağlanılamadı:', err.message);
  } else {
    console.log('✅ Veritabanına başarıyla bağlanıldı.');
  }
});

// ✔️ Router Bağlantıları
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// ✔️ Kullanıcı listesini döner
app.get('/api/kullanicilar', (req, res) => {
  const sql = 'SELECT * FROM kullanicilar';
  db.query(sql, (err, data) => {
    if (err) {
      console.error('❌ Kullanıcılar alınamadı:', err.message);
      return res.status(500).json({ error: 'Sunucu hatası!' });
    }
    return res.status(200).json(data);
  });
});

// ✔️ Socket.IO Ayarları
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"]
  }
});

let onlineUsers = [];

// ✔️ Socket.IO Bağlantıları
io.on("connection", (socket) => {
  console.log("🔌 Yeni bağlantı:", socket.id);

  socket.on("ogrenci-giris", (user) => {
    if (!onlineUsers.find(u => u.id === user.id)) {
      onlineUsers.push(user);
    }
    io.emit("online-kullanicilar", onlineUsers);
  });

  socket.on("ogrenci-cikis", (userId) => {
    onlineUsers = onlineUsers.filter(u => u.id !== userId);
    io.emit("online-kullanicilar", onlineUsers);
  });

  socket.on("disconnect", () => {
    console.log("❌ Bağlantı koptu:", socket.id);
  });
});

// ✔️ Sunucu Başlat
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Backend ${PORT} portunda çalışıyor.`);
});

