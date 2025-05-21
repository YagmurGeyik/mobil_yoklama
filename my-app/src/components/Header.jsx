import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "../styles/theme.css";

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [ogretmen, setOgretmen] = useState(null);

  useEffect(() => {
    const storedOgretmen = localStorage.getItem("ogretmen");

    if (storedOgretmen) {
      const parsedOgretmen = JSON.parse(storedOgretmen);
      setOgretmen(parsedOgretmen);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("ogretmen");
    setOgretmen(null);
    navigate("/");
  };

  return (
    <header className="header">
      <div className="logo">📚 Yoklama Sistemi</div>

      <nav className="nav-links">
        <Link to="/admin-panel">Admin Paneli</Link>
        <Link to="/dashboard">Dashboard</Link>
      </nav>

      <div className="auth-buttons">
        {ogretmen ? (
          <div className="user-info">
            <span className="welcome-text">{ogretmen.ad_soyad.toUpperCase()}</span>
            <button className="btn logout-button" onClick={handleLogout}>
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
