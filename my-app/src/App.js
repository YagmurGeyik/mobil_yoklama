// App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import AdminPanel from "./pages/AdminPanel";
import "./styles/theme.css";
import KullaniciListesi from "./KullaniciListesi"; // Doğru yolu kontrol et!
import OgretmenListesi from "./components/OgretmenListesi";
import OgrenciListesi from "./components/OgrenciListesi";
import "./styles/adminpanel.css";

// 🔒 AdminRoute bileşeni
const AdminRoute = ({ children }) => {
  let ogretmen = null;

  try {
    ogretmen = JSON.parse(localStorage.getItem("ogretmen"));
  } catch (error) {
    console.error("LocalStorage'dan ogretmen nesnesi okunamadı:", error.message);
  }

  if (!ogretmen || (ogretmen.yetki !== "dekan" && ogretmen.yetki !== "admin")) {
    console.warn("Yetkisiz giriş denemesi. Giriş sayfasına yönlendiriliyor...");
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin-panel" element={
            <AdminRoute>
              <AdminPanel />
            </AdminRoute>
          } />
          <Route path="/admin-panel/ogretmenler" element={
            <AdminRoute>
              <OgretmenListesi />
            </AdminRoute>
          } />
          <Route path="/admin-panel/ogrenciler" element={
            <AdminRoute>
              <OgrenciListesi />
            </AdminRoute>
          } />
          <Route path="/admin-panel/kullanicilar" element={
            <AdminRoute>
              <KullaniciListesi />
            </AdminRoute>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
