// components/OgretmenListesi.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const OgretmenListesi = () => {
  const [ogretmenler, setOgretmenler] = useState([]);
  const [formData, setFormData] = useState({
    ad_soyad: "",
    email: "",
    sifre: "",
    yetki: "ogretmen",
  });

  // Öğretmenleri çek
  const fetchOgretmenler = async () => {
    try {
      const res = await axios.get("/api/admin/ogretmenler");
      setOgretmenler(res.data);
    } catch (error) {
      console.error("Öğretmenleri çekerken hata:", error);
    }
  };

  useEffect(() => {
    fetchOgretmenler();
  }, []);

  // Form input değişikliklerini yönet
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Yeni öğretmen ekle
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/admin/ogretmenler", formData);
      setFormData({ ad_soyad: "", email: "", sifre: "", yetki: "ogretmen" });
      fetchOgretmenler();
      alert("Öğretmen başarıyla eklendi");
    } catch (error) {
      alert("Hata oluştu, kontrol et ve tekrar dene.");
      console.error(error);
    }
  };

  // Öğretmen sil
  const handleDelete = async (id) => {
    if (!window.confirm("Silmek istediğinize emin misiniz?")) return;
    try {
      await axios.delete(`/api/admin/ogretmenler/${id}`);
      fetchOgretmenler();
    } catch (error) {
      alert("Silme işleminde hata oluştu.");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Öğretmen Listesi</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="ad_soyad"
          placeholder="Ad Soyad"
          value={formData.ad_soyad}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="E-posta"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="sifre"
          placeholder="Şifre"
          value={formData.sifre}
          onChange={handleChange}
          required
        />
        <select name="yetki" value={formData.yetki} onChange={handleChange}>
          <option value="ogretmen">Öğretmen</option>
          <option value="admin">Admin</option>
          <option value="dekan">Dekan</option>
        </select>
        <button type="submit">Ekle</button>
      </form>

      <ul>
        {ogretmenler.map((o) => (
          <li key={o.id}>
            {o.ad_soyad} ({o.email}) - Rol: {o.yetki}{" "}
            <button onClick={() => handleDelete(o.id)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OgretmenListesi;
