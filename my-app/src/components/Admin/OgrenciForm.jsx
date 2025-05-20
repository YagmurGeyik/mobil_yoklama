// src/components/Admin/OgrenciForm.jsx
import React, { useState } from "react";
import api from "../../utils/api";

const OgrenciForm = ({ onRefresh }) => {
  const [form, setForm] = useState({ ad_soyad: "", ogrenci_no: "", sinif: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.post("/admin/ogrenciler", form);
    setForm({ ad_soyad: "", ogrenci_no: "", sinif: "" });
    onRefresh();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input placeholder="Ad Soyad" value={form.ad_soyad} onChange={(e) => setForm({ ...form, ad_soyad: e.target.value })} className="input" />
      <input placeholder="Öğrenci No" value={form.ogrenci_no} onChange={(e) => setForm({ ...form, ogrenci_no: e.target.value })} className="input" />
      <input placeholder="Sınıf" value={form.sinif} onChange={(e) => setForm({ ...form, sinif: e.target.value })} className="input" />
      <button type="submit" className="btn btn-primary">Ekle</button>
    </form>
  );
};

export default OgrenciForm;
