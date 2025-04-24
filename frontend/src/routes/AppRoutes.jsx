// src/routes/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Login from "../features/login/Login";
import FormGoal from "../features/goals/listGoals";
import ListGoals from "../features/goals/listGoals";
const AppRoutes = () => {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Rutas públicas */}
      {!user && (
        <>
          <Route path="/login" element={<Login />} />
          <Route path="/listGoals" element={<ListGoals />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </>
      )}

      {/* Rutas privadas */}
      {user && (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/goals" element={<formGoal />} />
          <Route path="*" element={<Navigate to="/" />} />
        </>
      )}
    </Routes>
  );
};

export default AppRoutes;
