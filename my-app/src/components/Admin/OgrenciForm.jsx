import React, { useState } from "react";
import axios from "axios";

const OgrenciForm = ({ onRefresh }) => {
  const [form, setForm] = useState({
    ad: "",
    soyad: "",
    email: "",
    password: "",
    studentNumber: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await axios.post("/api/admin/ogrenciler", form, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setForm({ ad: "", soyad: "", email: "", password: "", studentNumber: "" });
      if (onRefresh && typeof onRefresh === 'function') {
        onRefresh();
      }
      alert("Öğrenci başarıyla eklendi!");
    } catch (error) {
      console.error("Öğrenci eklenemedi:", error.response?.data?.error || error.message);
      alert("Öğrenci eklenirken hata oluştu.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <input
          name="ad"
          placeholder="Ad"
          value={form.ad}
          onChange={handleChange}
          className="input"
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div className="form-group">
        <input
          name="soyad"
          placeholder="Soyad"
          value={form.soyad}
          onChange={handleChange}
          className="input"
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div className="form-group">
        <input
          name="email"
          type="email"
          placeholder="E-posta"
          value={form.email}
          onChange={handleChange}
          className="input"
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div className="form-group">
        <input
          name="password"
          type="password"
          placeholder="Şifre"
          value={form.password}
          onChange={handleChange}
          className="input"
          required
          disabled={isSubmitting}
        />
      </div>
      
      <div className="form-group">
        <input
          name="studentNumber"
          placeholder="Öğrenci Numarası"
          value={form.studentNumber}
          onChange={handleChange}
          className="input"
          required
          disabled={isSubmitting}
        />
      </div>
      
      <button 
        type="submit" 
        className="btn btn-primary"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Ekleniyor..." : "Ekle"}
      </button>
    </form>
  );
};

export default OgrenciForm;