// backend/index.js

const express = require('express');
const cors = require('cors');
const http = require("http");
const socketIO = require("socket.io");

const db = require('./db'); // ✔️ Veritabanı bağlantısını db.js üzerinden al
const authRoutes = require('./routes/auth');     // ✔️ Auth route bağlandı
const adminRoutes = require('./routes/admin');   // ✔️ Admin route bağlandı

const app = express();
app.use(cors());
app.use(express.json());

// ✔️ Router Bağlantıları
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// ✔️ Kullanıcı listesini döner
app.get('/api/kullanicilar', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM kullanicilar');
    res.status(200).json(rows);
  } catch (err) {
    console.error('❌ Kullanıcılar alınamadı:', err.message);
    res.status(500).json({ error: 'Sunucu hatası!' });
  }
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
