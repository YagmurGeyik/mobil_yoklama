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

  const fetchOgretmenler = async () => {
    try {
      const res = await axios.get("/api/admin/ogretmenler");
      console.log(res.data); // Öğretmen adlarını kontrol etmek için

  
      setOgretmenler(res.data);
    } catch (error) {
      console.error("Öğretmenleri çekerken hata:", error);
    }
  };

  useEffect(() => {
    fetchOgretmenler();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
    <div className="panel-box">
      <h2 className="panel-title">Öğretmen Listesi</h2>
      
      <form className="form-container" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            className="input"
            type="text"
            name="ad_soyad"
            placeholder="Ad Soyad"
            value={formData.ad_soyad}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            className="input"
            type="email"
            name="email"
            placeholder="E-posta"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <input
            className="input"
            type="password"
            name="sifre"
            placeholder="Şifre"
            value={formData.sifre}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <select
            className="input"
            name="yetki"
            value={formData.yetki}
            onChange={handleChange}
          >
            <option value="ogretmen">Öğretmen</option>
            <option value="dekan">Dekan</option>
          </select>
        </div>

        <button className="btn btn-primary" type="submit">Ekle</button>
      </form>

      <div className="list-container">
        <div className="list-title">Kayıtlı Öğretmenler</div>
        <ul className="item-list">
          {ogretmenler.map((o) => (
            <li key={o.id}>
              <span>{decodeURIComponent(escape(o.ad_soyad))} ({o.email}) - Yetki: {o.yetki}</span>
              <button className="delete-btn" onClick={() => handleDelete(o.id)}>
              <span>🗑️</span> 
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default OgretmenListesi;
