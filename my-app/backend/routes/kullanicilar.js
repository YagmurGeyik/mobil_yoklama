const express = require("express");
const router = express.Router();

const mysql = require("mysql2/promise");
const dbPool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "yag0309ik",
  database: "online_yoklama",
  charset: "utf8mb4"
});

router.get("/", async (req, res) => {
  try {
    await dbPool.query("SET NAMES utf8mb4 COLLATE utf8mb4_turkish_ci");

    const [results] = await dbPool.query(`
      SELECT id, studentName, studentSurname, lesson, timestamp, sessionId, studentId
      FROM attendance
    `);

    const attendanceRecords = results.map((rec) => ({
      id: rec.id,
      studentName: rec.studentName,
      studentSurname: rec.studentSurname,
      lesson: rec.lesson,
      timestamp: rec.timestamp,
      sessionId: rec.sessionId,
      studentId: rec.studentId,
    }));

    res.json(attendanceRecords);
  } catch (err) {
    console.error("❌ Attendance kayıtları alınamadı:", err);
    res.status(500).json({ error: "Sunucu hatası" });
  }
});
module.exports = router;
