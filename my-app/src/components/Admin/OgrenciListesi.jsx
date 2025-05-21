// src/components/Admin/OgrenciListesi.jsx
import React, { useEffect, useState } from "react";
import api from "../../utils/api";
import OgrenciForm from "./OgrenciForm";

const OgrenciListesi = () => {
  const [ogrenciler, setOgrenciler] = useState([]);

  const fetchOgrenciler = async () => {
    const res = await api.get("/admin/ogrenciler");
    setOgrenciler(res.data);
  };

  const handleSil = async (id) => {
    if (window.confirm("Bu öğrenciyi silmek istediğinize emin misiniz?")) {
      await api.delete(`/admin/ogrenciler/${id}`);
      fetchOgrenciler();
    }
  };

  useEffect(() => {
    fetchOgrenciler();
  }, []);

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-semibold mb-4">🎓 Öğrenci Listesi</h2>
      <OgrenciForm onRefresh={fetchOgrenciler} />
      <ul className="mt-4">
  {ogrenciler.map((o) => (
    <li key={o.id} className="flex justify-between items-center py-1 border-b">
      <span>{o.ad} {o.soyad} - {o.studentNumber} - {o.email}</span>
      <button onClick={() => handleSil(o.id)} className="text-red-600 hover:underline">Sil</button>
    </li>
  ))}
</ul>

    </div>
  );
};

export default OgrenciListesi;
