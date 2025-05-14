import React from "react";
import QRCodeGenerator from "../components/QRCodeGenerator";
import KullaniciListesi from "../KullaniciListesi"; // Kullanıcı listesini içeri al
import "../styles/theme.css";

const Dashboard = () => {
  return (
    <div className="dashboard-layout">
      <div className="sidebar">
        <KullaniciListesi />
      </div>
      <div className="dashboard-main">
        <h2>ÖĞRETMEN KONTROL PANELİ</h2>
        <QRCodeGenerator />
      </div>
    </div>
  );
};

export default Dashboard;
