// QRCodeScreen.js
import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import axios from 'axios';

const QRCodeScreen = ({ navigation }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // ✔️ Öğrencinin QR Kodunu taradıktan sonra backend'e istekte bulunma
  const handleBarCodeScanned = async ({ type, data }) => {
    setScanned(true);

    // Backend'e POST isteği atma
    try {
      const response = await axios.post('http://localhost:3000/api/student/attendance', {
        student_id: '12345', // 👈 Öğrenci numarasını buraya ekle
        qr_code_data: data,  // 👈 QR koddan alınan veri
      });

      if (response.status === 200) {
        Alert.alert('Başarılı', 'Ders kaydınız başarıyla yapıldı.', [
          {
            text: 'Tamam',
            onPress: () => {
              navigation.goBack();
            },
          },
        ]);
      } else {
        Alert.alert('Hata', 'Ders kaydı yapılırken bir hata oluştu.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Sunucu Hatası', 'Backend ile bağlantı kurulamadı.');
    }
  };

  if (hasPermission === null) {
    return <Text>İzin bekleniyor...</Text>;
  }

  if (hasPermission === false) {
    return <Text>Konum ve Kamera izni verilmedi!</Text>;
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>QR Kod Okuma Ekranı</Text>
      <BarCodeScanner
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        style={{ height: 400, width: 400 }}
      />
      {scanned && (
        <Button title={'QR Kodu Yeniden Tara'} onPress={() => setScanned(false)} />
      )}
    </View>
  );
};

export default QRCodeScreen;
