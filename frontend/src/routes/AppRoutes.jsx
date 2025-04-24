// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Practica from "../features/practica/practica";
import Login from "../features/login/Login";
import Home from "../features/home/home";

const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Rutas públicas */}
      {!user && (
        <>
          <Route path="/practica" element={<Practica />} />
            <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      )}

      {/* Rutas privadas */}
      {user && (
        <>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
    </Routes>
  );
};

export default AppRoutes;