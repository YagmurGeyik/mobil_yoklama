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
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        sifre: password, // Şifreyi "sifre" olarak gönderiyoruz
      });

      if (response.status === 200) {
        alert("Giriş Başarılı!");

        // 💡 **localStorage'a doğru kaydettiğimizden emin olalım**
        console.log("Giriş yapan kullanıcı:", response.data.ogretmen);
        if (response.data.ogretmen) {
          // Ad ve soyadı büyük harfe çevirip kaydediyoruz
          response.data.ogretmen.ad_soyad = response.data.ogretmen.ad_soyad.toUpperCase();
          localStorage.setItem("ogretmen", JSON.stringify(response.data.ogretmen));

          // Kaydedildi mi kontrol edelim:
          console.log("LocalStorage'a kaydedildi:", localStorage.getItem("ogretmen"));
        }

        // Dashboard sayfasına yönlendir
        navigate("/dashboard");
      } else {
        alert(response.data.error);
      }
    } catch (error) {
      console.error("Giriş hatası:", error.message);
      alert("Sunucuya bağlanırken bir hata oluştu!");
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
