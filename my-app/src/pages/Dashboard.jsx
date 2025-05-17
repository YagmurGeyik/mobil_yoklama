import React, { useEffect, useState } from "react";
import QRCodeGenerator from "../components/QRCodeGenerator";
import KullaniciListesi from "../KullaniciListesi";
import "../styles/theme.css";

const Dashboard = () => {
  const [ogretmen, setOgretmen] = useState(null);

  useEffect(() => {
    const storedOgretmen = localStorage.getItem("ogretmen");
    if (storedOgretmen) {
      setOgretmen(JSON.parse(storedOgretmen));
    }
  }, []);

  return (
    <div className="dashboard-layout">
      <div className="sidebar">
        <KullaniciListesi />
      </div>
      <div className="dashboard-main">
        <h2>ÖĞRETMEN KONTROL PANELİ</h2>
        {ogretmen && <p>Hoşgeldiniz, {ogretmen.ad_soyad}!</p>}
        <QRCodeGenerator />
      </div>
    </div>
  );
};

export default Dashboard;
