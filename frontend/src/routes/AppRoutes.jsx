// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../features/login/Login";
import Register from "../features/register/Register";
import Home from "../features/home/Home";

const AppRoutes = () => {
  const { auth } = useAuth(); // Obtener el objeto auth del contexto
  const user = auth?.usuario; 
  return (
    console.log(user),
    <Routes>
      {/* Rutas públicas */}
      {!user && (
        <>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
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
