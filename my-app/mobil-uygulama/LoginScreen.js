import React, { useState, useEffect } from 'react';
import { Text, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator, View, Alert } from 'react-native';
import { TextInput, Surface } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';

// When testing in web mode on the same machine as the server,
// you can use localhost since both are on the same device
// For testing on physical devices, you'd need your actual IP address
const BACKEND_URL = "http://localhost:5000";

const LoginScreen = ({ navigation }) => {
  const [studentNumber, setStudentNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking');

  // Check if server is running when component mounts
  useEffect(() => {
    checkServerStatus();
  }, []);

  const checkServerStatus = async () => {
    try {
      const response = await fetch(`${BACKEND_URL}/api/test`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        setServerStatus('connected');
        console.log('Backend server is running');
      } else {
        setServerStatus('error');
        console.log('Backend server returned an error');
      }
    } catch (error) {
      setServerStatus('unreachable');
      console.error('Server status check failed:', error);
    }
  };

  const handleLogin = async () => {
    if (!studentNumber || !password) {
      Alert.alert("Hata", "Lütfen öğrenci numarası ve şifre girin.");
      return;
    }

    setIsLoading(true);

    try {
      console.log(`Attempting to login at: ${BACKEND_URL}/api/login`);
      console.log('Login payload:', { studentNumber, password });

      const response = await fetch(`${BACKEND_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          studentNumber: studentNumber,
          password: password
        })
      });

      // Log the raw response for debugging
      const responseText = await response.text();
      console.log('Raw response:', responseText);

      // Parse the response if it's valid JSON
      let data;
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        console.error('Error parsing response:', e);
        setIsLoading(false);
        Alert.alert("Hata", "Sunucu yanıtı geçerli bir format değil. Sunucu hata vermiş olabilir.");
        return;
      }

      if (response.ok) {
        setIsLoading(false);
        navigation.navigate('Dashboard', { user: data.ogrenci });
      } else {
        setIsLoading(false);
        Alert.alert("Hata", data.error || "Giriş başarısız");
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      Alert.alert(
        "Sunucu Hatası", 
        "Sunucu ile bağlantı kurulamadı. Sunucunun çalıştığından ve IP adresinin doğru olduğundan emin olun."
      );
    }
  };

  return (
    <LinearGradient 
      colors={['#f4f9ff', '#e6f0ff']} 
      style={styles.container}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.innerContainer}
      >
        <Surface style={styles.card}>
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Text style={styles.logoText}>OBS</Text>
            </View>
          </View>
          
          <Text style={styles.title}>Öğrenci Girişi</Text>
          <Text style={styles.subtitle}>Bilgilerinizle giriş yapın</Text>
          
          {serverStatus === 'unreachable' && (
            <View style={styles.serverStatus}>
              <Text style={styles.serverStatusTextError}>
                ⚠️ Sunucu bağlantısı kurulamadı
              </Text>
            </View>
          )}
          
          {serverStatus === 'connected' && (
            <View style={styles.serverStatus}>
              <Text style={styles.serverStatusTextSuccess}>
                ✅ Sunucu bağlantısı kuruldu
              </Text>
            </View>
          )}
          
          <TextInput
            label="Öğrenci Numaranız"
            value={studentNumber}
            onChangeText={setStudentNumber}
            style={styles.input}
            mode="outlined"
            keyboardType="numeric"
            outlineColor="#d0d9e8"
            activeOutlineColor="#5b87ff"
            theme={{ roundness: 12 }}
          />
          
          <TextInput
            label="Şifreniz"
            value={password}
            secureTextEntry
            onChangeText={setPassword}
            style={styles.input}
            mode="outlined"
            outlineColor="#d0d9e8"
            activeOutlineColor="#5b87ff"
            theme={{ roundness: 12 }}
          />
          
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleLogin}
            disabled={isLoading || serverStatus === 'unreachable'}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.loginButtonText}>Giriş Yap</Text>
            )}
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Şifremi Unuttum</Text>
          </TouchableOpacity>
          
          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>veya</Text>
            <View style={styles.dividerLine} />
          </View>
        </Surface>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  card: {
    borderRadius: 24,
    padding: 28,
    elevation: 4,
    backgroundColor: 'white',
    shadowColor: "#5b87ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  logoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#5b87ff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#5b87ff",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoText: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#303952',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#8395a7',
    textAlign: 'center',
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
    backgroundColor: '#ffffff',
    height: 56,
  },
  loginButton: {
    backgroundColor: '#5b87ff',
    borderRadius: 12,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: "#5b87ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  forgotPassword: {
    marginTop: 16,
    alignSelf: 'center',
  },
  forgotPasswordText: {
    color: '#5b87ff',
    fontSize: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e6e6e6',
  },
  dividerText: {
    paddingHorizontal: 12,
    color: '#8395a7',
    fontSize: 12,
  },
  serverStatus: {
    marginBottom: 16,
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
  },
  serverStatusTextError: {
    color: '#dc3545',
    fontWeight: '500',
  },
  serverStatusTextSuccess: {
    color: '#28a745',
    fontWeight: '500',
  },
});

export default LoginScreen;