// src/components/Admin/OgretmenListesi.jsx
import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import OgretmenForm from "./OgretmenForm";

const OgretmenListesi = () => {
  const [ogretmenler, setOgretmenler] = useState([]);

  const fetchOgretmenler = async () => {
    const res = await api.get("/admin/ogretmenler");
    setOgretmenler(res.data);
  };

  const handleSil = async (id) => {
    if (window.confirm("Bu öğretmeni silmek istediğinize emin misiniz?")) {
      await api.delete(`/admin/ogretmenler/${id}`);
      fetchOgretmenler();
    }
  };

  useEffect(() => {
    fetchOgretmenler();
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-semibold mb-4">📋 Öğretmen Listesi</h2>
      <OgretmenForm onRefresh={fetchOgretmenler} />
      <ul className="mt-4">
        {ogretmenler.map((o) => (
          <li key={o.id} className="flex justify-between items-center py-1 border-b">
            <span>{o.ad_soyad} ({o.email}) - {o.yetki}</span>
            <button onClick={() => handleSil(o.id)} className="text-red-600 hover:underline">Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OgretmenListesi;
