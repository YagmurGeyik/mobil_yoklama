// src/pages/LoginPage.jsx

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/theme.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();

  try {
    const response = await axios.post("http://localhost:5000/api/auth/giris", {
      email,
      sifre: password, 
    });

    if (response.status === 200 && response.data.token) {
      alert("Giriş Başarılı!");

      const { token } = response.data;

      // Token'ı localStorage'a kaydet
      localStorage.setItem("token", token);

      // Token'dan bağımsız olarak ad_soyad vs. varsa kaydet
      const ogretmenBilgi = JSON.parse(atob(token.split('.')[1])); // JWT payload'ı decode et
      localStorage.setItem("ogretmen", JSON.stringify(ogretmenBilgi));

      navigate("/dashboard");
    } else {
      alert(response.data.error || "Giriş başarısız!");
    }
  } catch (error) {
    console.error("Giriş hatası:", error);
    if (error.response?.data?.error) {
      alert(error.response.data.error);
    } else {
      alert("Sunucuya bağlanırken bir hata oluştu!");
    }
  }
};


  return (
    <div className="login-container">
      <div className="login-box">
        <h2 className="login-title">Giriş Yap</h2>
        <form onSubmit={handleLogin} className="login-form">
          <label className="login-label">E-posta </label>
          <input
            type="text"
            placeholder="E-posta adresinizi girin"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />

          <label className="login-label">Şifre</label>
          <input
            type="password"
            placeholder="Şifrenizi girin"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />

          <button type="submit" className="login-button">
            Giriş Yap
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
