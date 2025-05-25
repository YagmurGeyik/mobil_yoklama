import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import "../styles/theme.css";

const QRCodeGenerator = () => {
  const [sessionId, setSessionId] = useState("sess-" + Math.random().toString(36).substr(2, 9));
  const [timeLeft, setTimeLeft] = useState(900);
  const [lessonName, setLessonName] = useState(""); // Ders adı state'i
  const [isSessionActive, setIsSessionActive] = useState(false);

  useEffect(() => {
    let timer;
    if (isSessionActive) {
      timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setIsSessionActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [sessionId, isSessionActive]);

  const startSession = async () => {
    if (!lessonName.trim()) {
      alert("Lütfen ders adını girin!");
      return;
    }

    const newSessionId = "sess-" + Math.random().toString(36).substr(2, 9);
    setSessionId(newSessionId);
    setTimeLeft(900);
    setIsSessionActive(true);

    // Backend'e session bilgilerini gönder
    try {
      const response = await fetch('http://192.168.191.243:5000/api/session/create-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: newSessionId,
          lesson: lessonName,
          timestamp: new Date().toISOString()
        })
      });

      const result = await response.json();
      
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Session oluşturulamadı');
      }
      
      console.log('Session başarıyla oluşturuldu:', result);
    } catch (error) {
      console.error('Session oluşturma hatası:', error);
      alert('Session oluşturulamadı: ' + error.message);
      setIsSessionActive(false);
      return;
    }
  };

  const regenerateQR = () => {
    if (!lessonName.trim()) {
      alert("Lütfen ders adını girin!");
      return;
    }
    startSession();
  };

  // QR kod için JSON string oluştur
  const qrData = JSON.stringify({
    sessionId: sessionId,
    lesson: lessonName,
    timestamp: Date.now()
  });

  return (
    <div className="qr-generator">
      <div className="lesson-input">
        <label>Ders Adı:</label>
        <input
          type="text"
          value={lessonName}
          onChange={(e) => setLessonName(e.target.value)}
          placeholder="Örn: Matematik, Fizik, Kimya..."
          disabled={isSessionActive}
        />
      </div>

      {isSessionActive ? (
        <>
          <div className="session-info">
            <h3>Aktif Ders: {lessonName}</h3>
            <p>Session ID: {sessionId}</p>
          </div>
          <QRCodeSVG value={qrData} size={400} />
          <p className="countdown-text">
            Kalan Süre: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
          </p>
          <button onClick={regenerateQR}>Yeni QR Oluştur</button>
        </>
      ) : (
        <button onClick={startSession} disabled={!lessonName.trim()}>
          Oturumu Başlat
        </button>
      )}
    </div>
  );
};

export default QRCodeGenerator;