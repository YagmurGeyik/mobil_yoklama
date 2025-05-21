const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io"); 
const app = express();
const authRoutes = require("./routes/auth");
const adminRoutes = require("./routes/admin");
const kullanicilarRoutes = require("./routes/kullanicilar"); // Ekle
const PORT = process.env.PORT || 5000;
// Middleware
app.use(cors());
app.use(bodyParser.json());

// Route tanımları
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/kullanicilar", kullanicilarRoutes); 

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

// -----------------------
// Socket.io entegrasyonu
const server = http.createServer(app); // express app'i http server ile sarmalıyoruz

const io = new Server(server, {
  cors: {
    origin: "*", // İstersen frontend adresini buraya yazabilirsin
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("Bir kullanıcı bağlandı:", socket.id);

  socket.on("disconnect", () => {
    console.log("Kullanıcı ayrıldı:", socket.id);
  });

  // İstersen burada kendi socket eventlerini ekleyebilirsin
});
app.use("/api/kullanicilar", kullanicilarRoutes);

// Server'ı http server üzerinden başlatıyoruz (app.listen yerine)
server.listen(PORT, () => {
  console.log(`🚀 Sunucu ${PORT} portunda çalışıyor.`);
  console.log(`🌐 Admin rotası: http://localhost:${PORT}/api/admin`);
  console.log(`🌐 Auth rotası: http://localhost:${PORT}/api/auth`);
});
