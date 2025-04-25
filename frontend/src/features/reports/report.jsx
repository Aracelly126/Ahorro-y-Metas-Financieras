import React, { useState, Suspense, lazy } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  LabelList,
} from "recharts";
import { FaFilePdf, FaSpinner } from "react-icons/fa";

// Importación diferida de los componentes de PDF
const PDFViewer = lazy(() => import('@react-pdf/renderer').then(module => ({ default: module.PDFViewer })));
const PDFDownloadLink = lazy(() => import('@react-pdf/renderer').then(module => ({ default: module.PDFDownloadLink })));
const PdfGenerator = lazy(() => import('./PDFGenerator'));

const goalsData = [
  {
    goal_id: 1,
    goal_name: "Viaje a Europa",
    target_amount: 2000,
    current_amount: 2000,
    deadline_date: "2025-08-30",
    status: "completada",
  },
  {
    goal_id: 2,
    goal_name: "Laptop nueva",
    target_amount: 1000,
    current_amount: 300,
    deadline_date: "2025-06-01",
    status: "en espera",
  },
  {
    goal_id: 3,
    goal_name: "Curso online",
    target_amount: 500,
    current_amount: 100,
    deadline_date: "2025-04-01",
    status: "vencida",
  },
  {
    goal_id: 4,
    goal_name: "Nuevo celular",
    target_amount: 800,
    current_amount: 800,
    deadline_date: "2025-05-10",
    status: "completada",
  },
];

const COLORS = {
  completada: "#10b981",
  "en espera": "#3b82f6",
  vencida: "#ef4444",
};

const Report = ({ darkMode }) => {
  const totalGoals = goalsData.length;
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

  const statusCounts = {
    completada: goalsData.filter((g) => g.status === "completada").length,
    "en espera": goalsData.filter((g) => g.status === "en espera").length,
    vencida: goalsData.filter((g) => g.status === "vencida").length,
  };

  const statusData = Object.keys(statusCounts).map((key) => ({
    name: key,
    value: statusCounts[key],
    percentage: Math.round((statusCounts[key] / totalGoals) * 100),
  }));

  const chartData = goalsData.map((goal) => ({
    name: goal.goal_name,
    percentage: Math.min(
      100,
      Math.round((goal.current_amount / goal.target_amount) * 100)
    ),
  }));

  const handleViewPdf = async (goal) => {
    try {
      setPdfLoading(true);
      setSelectedGoal(goal);
      setShowPdfModal(true);
    } catch (error) {
      console.error("Error al cargar PDF:", error);
    } finally {
      setPdfLoading(false);
    }
  };

  return (
    <div className={`p-6 space-y-8 ${darkMode ? "text-white" : "text-gray-900"}`}>
      <h1 className={`text-3xl font-bold ${darkMode ? "text-white" : "text-black"}`}>
        Dashboard de Metas
      </h1>
      
      {/* Sección de resumen */}
      <div className="grid md:grid-cols-3 gap-4">
        {statusData.map((status) => (
          <div
            key={status.name}
            className={`p-4 rounded-xl shadow space-y-1 ${darkMode ? "bg-gray-700" : "bg-white"}`}
          >
            <h2 className="text-xl font-semibold capitalize">{status.name}</h2>
            <p>Total: {status.value}</p>
            <p>Porcentaje: {status.percentage}%</p>
          </div>
        ))}
      </div>

      {/* Gráficos */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className={`h-90 rounded-2xl shadow p-4 ${darkMode ? "bg-gray-700" : "bg-white"}`}>
          <h2 className="text-lg font-bold mb-2">Estado de las Metas</h2>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={statusData}
                dataKey="value"
                nameKey="name"
                outerRadius={90}
              >
                {statusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={
                  darkMode
                    ? {
                        backgroundColor: "#374151",
                        borderColor: "#4B5563",
                        color: "#F9FAFB",
                      }
                    : {}
                }
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className={`h-90 rounded-2xl shadow p-4 ${darkMode ? "bg-gray-700" : "bg-white"}`}>
          <h2 className="text-lg font-bold mb-2">Progreso de Metas (%)</h2>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={chartData}>
            <XAxis dataKey="name" />
              <XAxis stroke={darkMode ? "#E5E7EB" : "#6B7280"} />
              <YAxis stroke={darkMode ? "#E5E7EB" : "#6B7280"} />
              <Tooltip
                contentStyle={
                  darkMode
                    ? {
                        backgroundColor: "#374151",
                        borderColor: "#4B5563",
                        color: "#F9FAFB",
                      }
                    : {}
                }
              />
              <Bar dataKey="percentage" fill="#6366f1">
                <LabelList
                  dataKey="percentage"
                  position="top"
                  fill={darkMode ? "#E5E7EB" : "#4B5563"}
                />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detalle de metas */}
      <div>
        <h2 className={`text-xl font-bold mb-4 ${darkMode ? "text-white" : "text-black"}`}>
          Detalle de Metas
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {goalsData.map((goal) => (
            <div
              key={goal.goal_id}
              className={`p-4 rounded-xl shadow space-y-1 relative ${darkMode ? "bg-gray-700" : "bg-white"}`}
            >
              <button
                onClick={() => handleViewPdf(goal)}
                disabled={pdfLoading}
                className={`absolute top-4 right-4 px-3 py-1 text-sm font-medium rounded-md ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-100 hover:bg-blue-200 text-blue-800"
                } transition-colors duration-200 shadow-sm flex items-center gap-1`}
                title="Generar PDF"
              >
                {pdfLoading && goal.goal_id === selectedGoal?.goal_id ? (
                  <FaSpinner className="animate-spin" />
                ) : (
                  <FaFilePdf />
                )}
                View PDF
              </button>
              <h3 className="text-lg font-bold pr-8">{goal.goal_name}</h3>
              <p>Objetivo: ${goal.target_amount}</p>
              <p>Actual: ${goal.current_amount}</p>
              <p>Fecha límite: {goal.deadline_date}</p>
              <p
                className={`mt-2 text-sm font-semibold ${
                  goal.status === "completada"
                    ? "text-green-500"
                    : goal.status === "vencida"
                    ? "text-red-500"
                    : "text-blue-500"
                }`}
              >
                Estado: {goal.status}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal para PDF */}
      {showPdfModal && selectedGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className={`relative rounded-lg shadow-xl max-w-4xl w-full h-[90vh] ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <button
              onClick={() => setShowPdfModal(false)}
              className={`absolute top-4 right-4 p-2 rounded-full ${
                darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-200 hover:bg-gray-300"
              } z-10`}
            >
              ✕
            </button>
            
            <Suspense fallback={
              <div className="flex items-center justify-center h-full">
                <FaSpinner className="animate-spin text-4xl" />
              </div>
            }>
              <PDFViewer width="100%" height="100%">
                <PdfGenerator goal={selectedGoal} darkMode={darkMode} />
              </PDFViewer>
              
              <div className={`absolute bottom-4 right-4 ${
                darkMode ? "bg-gray-700" : "bg-gray-100"
              } p-2 rounded`}>
                <PDFDownloadLink 
                  document={<PdfGenerator goal={selectedGoal} darkMode={darkMode} />} 
                  fileName={`meta_${selectedGoal.goal_name.replace(/\s+/g, '_')}.pdf`}
                >
                  {({ loading }) => (
                    <button className={`px-4 py-2 rounded-md flex items-center gap-2 ${
                      darkMode
                        ? "bg-blue-600 hover:bg-blue-700 text-white"
                        : "bg-blue-100 hover:bg-blue-200 text-blue-800"
                    }`}>
                      {loading ? (
                        <>
                          <FaSpinner className="animate-spin" /> Generando...
                        </>
                      ) : (
                        <>
                          <FaFilePdf /> Descargar PDF
                        </>
                      )}
                    </button>
                  )}
                </PDFDownloadLink>
              </div>
            </Suspense>
          </div>
        </div>
      )}
    </div>
  );
};

export default Report;