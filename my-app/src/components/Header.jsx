
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/theme.css";

const Header = () => {
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="logo">📚 Yoklama Sistemi</div>
      <nav className="nav-links">
        <Link to="/">Ana Sayfa</Link>
        <Link to="/dashboard">Kontrol Paneli</Link>
      </nav>
      <div className="auth-buttons">
        <button className="btn" onClick={() => navigate("/")}>Giriş</button>
      </div>
    </header>
  );
};

export default Header;
