import React, { useEffect, useState } from "react";
import axios from "axios";

const OgrenciListesi = () => {
  const [ogrenciler, setOgrenciler] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOgrenciler = async () => {
    setLoading(true);
    try {
      const res = await axios.get("/api/admin/ogrenciler", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setOgrenciler(res.data);
    } catch (error) {
      console.error("Öğrencileri çekerken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOgrenciler();
  }, []);

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
    <div className="panel-box">
      <h2 className="panel-title">Öğrenci Listesi</h2>

      {loading ? (
        <div className="loading">Yükleniyor...</div>
      ) : ogrenciler.length === 0 ? (
        <p className="no-data">Henüz öğrenci bulunmamaktadır.</p>
      ) : (
        <div className="list-container">
          <div className="list-title">Kayıtlı Öğrenciler</div>
          <ul className="item-list">
            {ogrenciler.map((o) => (
              <li key={o.id}>
                <span>
                  {o.ad} {o.soyad} - {o.studentNumber} - {o.email}
                </span>
                <button 
  className="delete-btn" 
  onClick={() => handleDelete(o.id)}
>
  <span>🗑️</span> 
</button>

              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default OgrenciListesi;
