import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/theme.css";

const Header = () => {
  const navigate = useNavigate();
  const [ogretmen, setOgretmen] = useState(null);

  useEffect(() => {
    const storedOgretmen = localStorage.getItem("ogretmen");
    console.log("LocalStorage'dan çekilen öğretmen:", storedOgretmen); // <-- Kontrol ediyoruz
    if (storedOgretmen) {
      const parsedOgretmen = JSON.parse(storedOgretmen);
      setOgretmen(parsedOgretmen);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("ogretmen");
    setOgretmen(null);
    navigate("/");
  };

  return (
    <header className="header">
      <div className="logo">📚 Yoklama Sistemi</div>
      <div className="auth-buttons">
        {ogretmen ? (
          <div className="user-info">
            <span className="welcome-text">{ogretmen.ad_soyad}</span>
            <button className="btn" onClick={handleLogout}>
              Çıkış Yap
            </button>
          </div>
        ) : (
          <button className="btn" onClick={() => navigate("/")}>
            Giriş
          </button>
        )}
      </div>
    </header>
  );
};

export default Header;
