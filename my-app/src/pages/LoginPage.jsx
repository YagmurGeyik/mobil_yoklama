import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/theme.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, sifre: password }), // Şifreyi "sifre" olarak göndermemiz gerekiyor
      });

      const data = await response.json();

      if (response.ok) {
        alert("Giriş Başarılı!");

        // 💡 **localStorage'a doğru kaydettiğimizden emin olalım**
        console.log("Giriş yapan kullanıcı:", data.ogretmen); // Konsolda doğru bilgi var mı kontrol et
        if (data.ogretmen) {
        // Ad ve soyadı büyük harfe çevirip kaydediyoruz
        data.ogretmen.ad_soyad = data.ogretmen.ad_soyad.toUpperCase();
        localStorage.setItem("ogretmen", JSON.stringify(data.ogretmen));

        // Kaydedildi mi kontrol edelim:
        console.log("LocalStorage'a kaydedildi:", localStorage.getItem("ogretmen"));
        }

        // Dashboard sayfasına yönlendir
        navigate("/dashboard");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Giriş hatası:", error);
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
