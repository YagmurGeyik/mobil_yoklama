// src/pages/AdminPanel.jsx
import React from "react";
import OgretmenListesi from "../components/Admin/OgretmenListesi";
import OgrenciListesi from "../components/Admin/OgrenciListesi";

const AdminPanel = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">👨‍🎓 Admin Paneli</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <OgretmenListesi />
        <OgrenciListesi />
      </div>
    </div>
  );
};

export default AdminPanel;
