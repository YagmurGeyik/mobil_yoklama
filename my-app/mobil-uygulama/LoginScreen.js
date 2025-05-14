// LoginScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [studentNumber, setStudentNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (studentNumber && password) {
      // Geçici olarak direkt navigasyon ekledim, backend sonrası kontrol eklenecek
      navigation.navigate('Dashboard');
    } else {
      alert("Lütfen öğrenci numarası ve şifre girin.");
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Öğrenci Numarası"
        value={studentNumber}
        onChangeText={setStudentNumber}
        style={{ marginBottom: 10, borderWidth: 1, padding: 10 }}
      />
      <TextInput
        placeholder="Şifre"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={{ marginBottom: 10, borderWidth: 1, padding: 10 }}
      />
      <Button title="Giriş Yap" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
