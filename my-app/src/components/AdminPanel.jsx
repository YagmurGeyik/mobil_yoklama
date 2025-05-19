import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/theme.css";

const AdminPanel = () => {
  const [ogretmenler, setOgretmenler] = useState([]);
  const [ogrenciler, setOgrenciler] = useState([]);

  // Yeni öğretmen için state
  const [newOgretmen, setNewOgretmen] = useState({ ad_soyad: "", email: "", sifre: "", yetki: "ogretmen" });
  // Yeni öğrenci için state
  const [newOgrenci, setNewOgrenci] = useState({ ad_soyad: "", ogrenci_no: "", sinif: "" });

  // Verileri çek
  const fetchData = () => {
    axios.get("http://localhost:3001/api/admin/ogretmenler")
      .then(res => setOgretmenler(res.data))
      .catch(err => console.error(err));
    axios.get("http://localhost:3001/api/admin/ogrenciler")
      .then(res => setOgrenciler(res.data))
      .catch(err => console.error(err));
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Öğretmen ekle
  const handleAddOgretmen = () => {
    axios.post("http://localhost:3001/api/admin/ogretmenler", newOgretmen)
      .then(() => {
        setNewOgretmen({ ad_soyad: "", email: "", sifre: "", yetki: "ogretmen" });
        fetchData();
      })
      .catch(err => console.error(err));
  };

  // Öğrenci ekle
  const handleAddOgrenci = () => {
    axios.post("http://localhost:3001/api/admin/ogrenciler", newOgrenci)
      .then(() => {
        setNewOgrenci({ ad_soyad: "", ogrenci_no: "", sinif: "" });
        fetchData();
      })
      .catch(err => console.error(err));
  };

  // Öğretmen sil
  const handleDeleteOgretmen = (id) => {
    axios.delete(`http://localhost:3001/api/admin/ogretmenler/${id}`)

      .then(() => fetchData())
      .catch(err => console.error(err));
  };

  // Öğrenci sil
  const handleDeleteOgrenci = (id) => {
    axios.delete(`http://localhost:3001/api/admin/ogrenciler/${id}`)
      .then(() => fetchData())
      .catch(err => console.error(err));
  };

  return (
    <div className="admin-panel">
      <h2>Admin Paneli</h2>

      <div className="list-container">
        {/* Öğretmenler */}
        <div className="list">
          <h3>Öğretmenler Listesi</h3>
          <ul>
            {ogretmenler.map(o => (
              <li key={o.id}>
                <Link to={`/admin/ogretmenler/${o.id}`}>{o.ad_soyad}</Link> - {o.email} - {o.yetki}
                <button onClick={() => handleDeleteOgretmen(o.id)} style={{ marginLeft: 10 }}>Sil</button>
              </li>
            ))}
          </ul>

          <h4>Yeni Öğretmen Ekle</h4>
          <input
            type="text"
            placeholder="Ad Soyad"
            value={newOgretmen.ad_soyad}
            onChange={e => setNewOgretmen({...newOgretmen, ad_soyad: e.target.value})}
          />
          <input
            type="email"
            placeholder="Email"
            value={newOgretmen.email}
            onChange={e => setNewOgretmen({...newOgretmen, email: e.target.value})}
          />
          <input
            type="password"
            placeholder="Şifre"
            value={newOgretmen.sifre}
            onChange={e => setNewOgretmen({...newOgretmen, sifre: e.target.value})}
          />
          <select
            value={newOgretmen.yetki}
            onChange={e => setNewOgretmen({...newOgretmen, yetki: e.target.value})}
          >
            <option value="ogretmen">Öğretmen</option>
            <option value="dekan">Dekan</option>
          </select>
          <button onClick={handleAddOgretmen}>Ekle</button>
        </div>

        {/* Öğrenciler */}
        <div className="list">
          <h3>Öğrenciler Listesi</h3>
          <ul>
            {ogrenciler.map(o => (
              <li key={o.id}>
                <Link to={`/admin/ogrenciler/${o.id}`}>{o.ad_soyad}</Link> - {o.ogrenci_no} - {o.sinif}
                <button onClick={() => handleDeleteOgrenci(o.id)} style={{ marginLeft: 10 }}>Sil</button>
              </li>
            ))}
          </ul>

          <h4>Yeni Öğrenci Ekle</h4>
          <input
            type="text"
            placeholder="Ad Soyad"
            value={newOgrenci.ad_soyad}
            onChange={e => setNewOgrenci({...newOgrenci, ad_soyad: e.target.value})}
          />
          <input
            type="text"
            placeholder="Öğrenci No"
            value={newOgrenci.ogrenci_no}
            onChange={e => setNewOgrenci({...newOgrenci, ogrenci_no: e.target.value})}
          />
          <input
            type="text"
            placeholder="Sınıf"
            value={newOgrenci.sinif}
            onChange={e => setNewOgrenci({...newOgrenci, sinif: e.target.value})}
          />
          <button onClick={handleAddOgrenci}>Ekle</button>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
