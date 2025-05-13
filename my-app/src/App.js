import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import Header from "./components/Header";
import Admin from "./components/Admin";
import "./styles/theme.css";
import KullaniciListesi from "./KullaniciListesi";

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin" element={<Admin />} />
           <Route path="/kullanicilar" element={<KullaniciListesi />} /> {/* Yeni rota */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;