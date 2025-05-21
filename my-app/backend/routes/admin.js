// src/components/Admin/OgrenciForm.jsx
import React, { useState } from "react";
import api from "../../utils/api";

const OgrenciForm = ({ onRefresh }) => {
  const [form, setForm] = useState({
    ad: "",
    soyad: "",
    email: "",
    password: "",
    studentNumber: ""
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/admin/ogrenciler", form);
      setForm({ ad: "", soyad: "", email: "", password: "", studentNumber: "" });
      onRefresh();
    } catch (error) {
      console.error("Öğrenci eklenemedi:", error.response?.data?.error || error.message);
      alert("Öğrenci eklenirken hata oluştu.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        name="ad"
        placeholder="Ad"
        value={form.ad}
        onChange={handleChange}
        className="input"
      />
      <input
        name="soyad"
        placeholder="Soyad"
        value={form.soyad}
        onChange={handleChange}
        className="input"
      />
      <input
        name="email"
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        className="input"
      />
      <input
        name="password"
        type="password"
        placeholder="Şifre"
        value={form.password}
        onChange={handleChange}
        className="input"
      />
      <input
        name="studentNumber"
        placeholder="Öğrenci No"
        value={form.studentNumber}
        onChange={handleChange}
        className="input"
      />
      <button type="submit" className="btn btn-primary">Ekle</button>
    </form>
  );
};

export default OgrenciForm;
