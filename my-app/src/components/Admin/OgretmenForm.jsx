// src/components/Admin/OgretmenForm.jsx
import React, { useState } from "react";
import api from "../../utils/api";

const OgretmenForm = ({ onRefresh }) => {
  const [form, setForm] = useState({
    ad_soyad: "",
    email: "",
    sifre: "",
    yetki: "ogretmen",
  });

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await api.post("/admin/ogretmenler", form);
    alert("Öğretmen başarıyla eklendi!");
    setForm({ ad_soyad: "", email: "", sifre: "", yetki: "ogretmen" });
    onRefresh();
  } catch (error) {
    console.error(error);
    alert(error.response?.data?.error || "Bir hata oluştu!");
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input placeholder="Ad Soyad" value={form.ad_soyad} onChange={(e) => setForm({ ...form, ad_soyad: e.target.value })} className="input" />
      <input placeholder="E-posta" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="input" />
      <input placeholder="Şifre" type="password" value={form.sifre} onChange={(e) => setForm({ ...form, sifre: e.target.value })} className="input" />
      <select value={form.yetki} onChange={(e) => setForm({ ...form, yetki: e.target.value })} className="input">
        <option value="ogretmen">Öğretmen</option>
        <option value="dekan">Dekan</option>
      </select>
      <button type="submit" className="btn btn-primary">Ekle</button>
    </form>
  );
};

export default OgretmenForm;
