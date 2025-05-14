import React, { useEffect, useState } from 'react';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:3001'); // Socket bağlantısı

function KullaniciListesi() {
  const [kullanicilar, setKullanicilar] = useState([]);

  // Sayfa ilk yüklendiğinde backend'den mevcut kullanıcıları çek
  useEffect(() => {
    axios.get('http://localhost:3001/kullanicilar')
      .then(res => {
        setKullanicilar(res.data);
        console.log("Başlangıç verisi:", res.data);
      })
      .catch(err => {
        console.log('Veri alınamadı', err);
      });
  }, []);

  // Socket ile gelen veriyi dinle
  useEffect(() => {
    socket.on("online-kullanicilar", (data) => {
      console.log("Socket üzerinden güncel kullanıcılar:", data);
      setKullanicilar(data);
    });

    return () => {
      socket.off("online-kullanicilar");
    };
  }, []);

  return (
    <div>
      <h1>Aktif Öğrenciler</h1>
      <ul>
        {kullanicilar.map((kullanici, index) => (
          <li key={index}>
            {kullanici.ad} {kullanici.soyad}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default KullaniciListesi;
