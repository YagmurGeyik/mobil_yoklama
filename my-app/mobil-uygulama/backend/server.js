const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = 5002;

// Middleware
app.use(cors({
  origin: '*', // Allow all origins
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(bodyParser.json());

// MySQL Database Connection
const db = mysql.createConnection({
  host: "localhost",      // Database server address
  user: "root",           // MySQL username
  password: "yag0309ik",  // MySQL password
  database: "online_yoklama" // Database name
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL connection error:", err.message);
  } else {
    console.log("✅ MySQL connected successfully!");
  }
});

// Test Endpoint (Connection Check)
app.get('/api/test', (req, res) => {
  db.query('SELECT 1 + 1 AS solution', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(200).json({ message: "Connection successful!", solution: results[0].solution });
    }
  });
});

// Login Endpoint
app.post('/api/login', (req, res) => {
  console.log("Login attempt received:", req.body);
  
  const { studentNumber, password } = req.body;
  
  if (!studentNumber || !password) {
    return res.status(400).json({ error: "Student number and password are required." });
  }

  const query = "SELECT * FROM ogrenciler WHERE studentNumber = ? AND password = ?";
  db.query(query, [studentNumber, password], (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error." });
    }
    
    if (results.length === 0) {
      return res.status(401).json({ error: "Incorrect student number or password." });
    }
    
    const ogrenci = results[0];
    
    // Update active status to 1 if login is successful
    const updateQuery = "UPDATE ogrenciler SET aktif_durum = 1 WHERE id = ?";
    db.query(updateQuery, [ogrenci.id], (err2) => {
      if (err2) {
        console.error("Status update error:", err2);
        return res.status(500).json({ error: "Status could not be updated." });
      }
      
      res.json({ 
        message: "Login successful", 
        ogrenci: { 
          id: ogrenci.id, 
          ad: ogrenci.ad, 
          studentNumber: ogrenci.studentNumber 
        } 
      });
    });
  });
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`Test endpoint: http://localhost:${PORT}/api/test`);
  console.log(`Login endpoint: http://localhost:${PORT}/api/login`);
});