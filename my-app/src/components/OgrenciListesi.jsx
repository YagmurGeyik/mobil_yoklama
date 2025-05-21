// components/OgrenciListesi.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const OgrenciListesi = () => {
  const [ogrenciler, setOgrenciler] = useState([]);
  const [formData, setFormData] = useState({
    ad: "",
    soyad: "",
    email: "",
    password: "",
    studentNumber: "",
  });

  const fetchOgrenciler = async () => {
    try {
      const res = await axios.get("/api/admin/ogrenciler", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Token eklendi
        },
      });
      setOgrenciler(res.data);
    } catch (error) {
      console.error("Öğrencileri çekerken hata:", error);
    }
  };

  useEffect(() => {
    fetchOgrenciler();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/admin/ogrenciler", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFormData({
        ad: "",
        soyad: "",
        email: "",
        password: "",
        studentNumber: "",
      });
      fetchOgrenciler();
      alert("Öğrenci başarıyla eklendi");
    } catch (error) {
      alert("Hata oluştu, lütfen alanları kontrol edin.");
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Öğrenciyi silmek istediğinize emin misiniz?")) return;
    try {
      await axios.delete(`/api/admin/ogrenciler/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
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
          name="ad"
          placeholder="Ad"
          value={formData.ad}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="soyad"
          placeholder="Soyad"
          value={formData.soyad}
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
          name="password"
          placeholder="Şifre"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="studentNumber"
          placeholder="Öğrenci Numarası"
          value={formData.studentNumber}
          onChange={handleChange}
          required
        />
        <button type="submit">Ekle</button>
      </form>

      <ul>
        {ogrenciler.map((o) => (
          <li key={o.id}>
            {o.ad} {o.soyad} | No: {o.studentNumber} | E-posta: {o.email} | Durum:{" "}
            {o.aktif_durum ? "Aktif" : "Pasif"}{" "}
            <button onClick={() => handleDelete(o.id)}>Sil</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OgrenciListesi;
