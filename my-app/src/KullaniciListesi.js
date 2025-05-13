import React, { useEffect, useState } from 'react';
import axios from 'axios';

function KullaniciListesi() {
  const [kullanicilar, setKullanicilar] = useState([]);

  useEffect(() => {
  axios.get('http://localhost:3001/kullanicilar')
    .then(res => {
      setKullanicilar(res.data);
      console.log(res.data); // Burada veriyi console'a yazdırarak verilerin gelip gelmediğini kontrol edin
    })
    .catch(err => {
      console.log('Veri alınamadı', err);
    });
}, []);


  return (
    <div>
      <h1>Kullanıcılar</h1>
      <ul>
        {kullanicilar.map((k, index) => (
          <li key={index}>{k.ad} {k.soyad}</li>
        ))}
      </ul>
    </div>
  );
}

export default KullaniciListesi;
