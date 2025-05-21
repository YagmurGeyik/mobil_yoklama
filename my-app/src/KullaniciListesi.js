import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

function KullaniciListesi() {
  const [kullanicilar, setKullanicilar] = useState([]);

  useEffect(() => {
    const socket = io('http://localhost:5000');

    // Sahte kullanıcıyı doğrudan emit et
    const girisYapanKullanici = {
      id: "ogrenci123",
      ad: "Ali",
      soyad: "Yılmaz"
    };
    socket.emit("kullanici-giris", girisYapanKullanici);

    socket.on("online-kullanicilar", (data) => {
      console.log("Socket üzerinden güncel kullanıcılar:", data);
      setKullanicilar(data);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    axios.get("http://localhost:5000/api/kullanicilar")
      .then(res => {
        setKullanicilar(res.data);
        console.log("Başlangıç verisi:", res.data);
      })
      .catch(err => {
        console.error('Veri alınamadı', err);
      });
  }, []);

  return (
    <div>
      <h1>Aktif Öğrenciler</h1>
      <ul>
        {kullanicilar.map((kullanicilar, index) => (
          <li key={index}>
            {kullanicilar.ad} {kullanicilar.soyad}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default KullaniciListesi;
