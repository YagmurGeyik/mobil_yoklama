import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import "../styles/theme.css";

const QRCodeGenerator = () => {
  const [sessionId, setSessionId] = useState("sess-" + Math.random().toString(36).substr(2, 9));
  const [timeLeft, setTimeLeft] = useState(900);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [sessionId]);

  const regenerateQR = () => {
    setSessionId("sess-" + Math.random().toString(36).substr(2, 9));
    setTimeLeft(900);
  };

  return (
    <div className="qr-generator">
      <QRCodeSVG value={sessionId} size={400} />
      <p className="countdown-text">
  Kalan Süre: {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, "0")}
</p>

      <button onClick={regenerateQR}>Yeni QR Oluştur</button>
    </div>
  );
};

export default QRCodeGenerator;