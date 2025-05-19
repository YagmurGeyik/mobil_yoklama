// components/OgrenciListesi.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const OgrenciListesi = () => {
  const [ogrenciler, setOgrenciler] = useState([]);
  const [formData, setFormData] = useState({
    ad_soyad: "",
    ogrenci_no: "",
    sinif: "",
    ogretmen_id: "",
  });

  // Öğrencileri çek
  const fetchOgrenciler = async () => {
    try {
      const res = await axios.get("/api/admin/ogrenciler");
      setOgrenciler(res.data);
    } catch (error) {
      console.error("Öğrencileri çekerken hata:", error);
    }
  };

  useEffect(() => {
    fetchOgrenciler();
  }, []);

  // Form input değişikliklerini yönet
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Yeni öğrenci ekle
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/admin/ogrenciler", formData);
      setFormData({ ad_soyad: "", ogrenci_no: "", sinif: "", ogretmen_id: "" });
      fetchOgrenciler();
      alert("Öğrenci başarıyla eklendi");
    } catch (error) {
      alert("Hata oluştu, kontrol et ve tekrar dene.");
      console.error(error);
    }
  };

  // Öğrenci sil
  const handleDelete = async (id) => {
    if (!window.confirm("Silmek istediğinize emin misiniz?")) return;
    try {
      await axios.delete(`/api/admin/ogrenciler/${id}`);
      fetchOgrenciler();
    } catch (error) {
      alert("Silme işleminde hata oluştu.");
      console.error(error);
    }
  };

  return (
    <div>
      <h2>Öğrenci Listesi</h2>
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
          type="text"
          name="ogrenci_no"
          placeholder="Öğrenci Numarası"
          value={formData.ogrenci_no}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="sinif"
          placeholder="Sınıf"
          value={formData.sinif}
          onChange={handleChange}
          required
        />
        <input
          type="number"
          name="ogretmen_id"
          placeholder="Öğretmen ID"
          value={formData.ogretmen_id}
          onChange={handleChange}
          required
        />
        <button type="submit">Ekle</button>
      </form>

      <ul>
        {ogrenciler.map((o) => (
          <li key={o.id}>
            {o.ad_soyad} (No: {o.ogrenci_no}) - Sınıf: {o.sinif} - Öğretmen ID: {o.ogretmen_id}{" "}
            <button onClick={() => handleDelete(o.id)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OgrenciListesi;
