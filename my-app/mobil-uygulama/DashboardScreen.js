// DashboardScreen.js
import React, { useEffect, useState } from 'react';
import { View, Text, Button } from 'react-native';
import * as Location from 'expo-location';

const DashboardScreen = ({ navigation }) => {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  // İstediğin konum koordinatlarını buraya ekle
  const targetLatitude = 38.029032;   // Enlem
  const targetLongitude = 32.509249;  // Boylam

  useEffect(() => {
    (async () => {
      // Konum izni iste
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Konum izni verilmedi');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const checkLocation = () => {
    if (!location) return;

    const { latitude, longitude } = location.coords;
    const distance = getDistance(latitude, longitude, targetLatitude, targetLongitude);

    if (distance < 5000000) { // 50 metre sınırı
      alert("Doğru konumdasınız, QR kod ekranına yönlendiriliyorsunuz.");
      navigation.navigate('QRCodeScreen');
    } else {
      alert("Yanlış konumdasınız. Lütfen doğru yere gidin.");
    }
  };

  // İki konum arasındaki mesafeyi metre cinsinden hesaplama
  const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371000; // Dünya'nın yarıçapı (metre)
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Mesafe (metre)
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Dashboard Ekranı</Text>
      <Button title="Konumu Kontrol Et" onPress={checkLocation} />
    </View>
  );
};

export default DashboardScreen;
