// src/pages/AdminPanel.jsx
import React from "react";
import OgretmenListesi from "../components/Admin/OgretmenListesi";
import OgrenciListesi from "../components/Admin/OgrenciListesi";
import "../styles/adminpanel.css";

const AdminPanel = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">👨‍🎓 Admin Paneli</h1>
      <div className="admin-panel-container">
  <div className="panel-box">
    <h2 className="panel-title">👨‍🏫 Öğretmen Paneli</h2>
    <OgretmenListesi />
  </div>

  <div className="panel-box">
    <h2 className="panel-title">👨‍🎓 Öğrenci Paneli</h2>
    <OgrenciListesi />
  </div>
</div>

    </div>
  );
};

export default AdminPanel;
