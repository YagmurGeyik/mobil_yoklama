import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/theme.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === "ogretmen@test.com" && password === "1234") {
      navigate("/dashboard");
    } else {
      alert("Geçersiz giriş bilgileri");
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Giriş Yap</h2>
        <form onSubmit={handleLogin} className="login-form">
          <label className="login-label">E-posta veya Telefon Numarası</label>
          <input
            type="text"
            placeholder=""
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          
          <label className="login-label">Şifre</label>
          <input
            type="password"
            placeholder=""
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />
          
          <button type="submit" className="login-button">Giriş Yap</button>
        </form>
    
      </div>
    </div>
  );
};

export default LoginPage;
