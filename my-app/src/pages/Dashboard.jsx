import React from "react";
import QRCodeGenerator from "../components/QRCodeGenerator";
import "../styles/theme.css";

const Dashboard = () => {
  return (
    <div className="dashboard-container">
      <h2>ÖĞRETMEN KONTROL PANELİ</h2>
      <QRCodeGenerator />
    </div>
  );
};

export default Dashboard;