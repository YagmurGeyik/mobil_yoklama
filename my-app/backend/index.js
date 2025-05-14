// backend/index.js

const express = require('express');
const mysql = require('mysql2'); 
const cors = require('cors');
const http = require("http");
const socketIO = require("socket.io");

const app = express();
app.use(cors()); // React'tan gelen istekleri kabul eder
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',       // MySQL kullanıcı adın
  password: 'yag0309ik',       // Şifren varsa buraya yaz
  database: 'online_yoklama' // Yukarıda oluşturduğun veritabanı
});

// Kullanıcı listesini döner
app.get('/kullanicilar', (req, res) => {
  const sql = 'SELECT * FROM kullanicilar';
  db.query(sql, (err, data) => {
    if (err) return res.json({ hata: err });
    return res.json(data);
  });
});

// Sunucu başlat
app.listen(3001, () => {
  console.log('Sunucu 3001 portunda çalışıyor');
});
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: "http://localhost:3000", // React frontend
    methods: ["GET", "POST"]
  }
});

let onlineUsers = [];

io.on("connection", (socket) => {
  console.log("Yeni bağlantı:", socket.id);

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
    console.log("Bağlantı koptu:", socket.id);
  });
});

server.listen(3001, () => {
  console.log("Backend 3001 portunda çalışıyor.");
});
