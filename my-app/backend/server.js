const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io"); 
const app = express();
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const kullanicilarRoutes = require("./routes/kullanicilar");
const sessionsRoutes = require('./routes/sessions');  // Ekle
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(bodyParser.json());

// TÜRKÇE karakterler için UTF-8 charset
app.use((req, res, next) => {
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  next();
});

// Route tanımları
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/kullanicilar", kullanicilarRoutes);
app.use("/api/sessions", sessionsRoutes);  

// Ana sayfa
app.get("/", (req, res) => {
  res.send("Ana sayfa");
});

// Genel hata yakalama middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Sunucu hatası!" });
});

// 404 handler - tanımlanmamış rotalar için
app.use((req, res) => {
  res.status(404).json({ error: "Sayfa bulunamadı" });
});

// HTTP sunucusunu oluştur
const server = http.createServer(app);

// Socket.io entegrasyonu
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

global.io = io; // ⬅️ Diğer dosyalarda kullanabilmek için global

io.on("connection", (socket) => {
  console.log("Bir kullanıcı bağlandı:", socket.id);

  socket.on("disconnect", () => {
    console.log("Kullanıcı ayrıldı:", socket.id);
  });
});

// Server'ı başlat
server.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor.`);
  console.log(`🌐 Admin rotası: http://localhost:${PORT}/api/admin`);
  console.log(`🌐 Auth rotası: http://localhost:${PORT}/api/auth`);
});