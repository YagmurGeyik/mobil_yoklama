import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../styles/theme.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [ogretmen, setOgretmen] = useState(null);
  
  useEffect(() => {
      const storedOgretmen = localStorage.getItem("ogretmen");
      console.log("LocalStorage'dan çekilen öğretmen:", storedOgretmen);
  
      if (storedOgretmen) {
        const parsedOgretmen = JSON.parse(storedOgretmen);
        setOgretmen(parsedOgretmen);
      }
    }, [location.pathname]); // 🔄 Sayfa her değiştiğinde kontrol et
  
    const handleLogout = () => {
      localStorage.removeItem("ogretmen");
      setOgretmen(null);
      navigate("/");
    };
  
  const toTurkishUpper = (str) => {
    const letters = { i: "İ", ı: "I", ş: "Ş", ğ: "Ğ", ü: "Ü", ö: "Ö", ç: "Ç" };
    return str
      .replace(/i|ı|ş|ğ|ü|ö|ç/g, (letter) => letters[letter])
      .toUpperCase();
  };
  
  return (
    <header className="admin-header">
      <div className="logo">📚 Yoklama Sistemi</div>
      
      <nav className="nav-links">
        <Link to="/admin-panel">Admin Paneli</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>
      
      <div className="auth-buttons">
        {ogretmen ? (
          <div className="user-info">
<span className="welcome-text">
  {toTurkishUpper(decodeURIComponent(escape(ogretmen.ad_soyad)))}
</span>
            <button className="logout-btn" onClick={handleLogout}>
              Çıkış Yap
            </button>
          </div>
        ) : (
          <button className="btn" onClick={() => navigate("/")}>
            Giriş Yap
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;