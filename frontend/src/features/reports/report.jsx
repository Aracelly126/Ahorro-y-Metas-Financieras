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
import { FaFilePdf } from "react-icons/fa";

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

  return (
    <div
      className={`p-6 space-y-8 ${darkMode ? "text-white" : "text-gray-900"}`}
    >
      <h1
        className={`text-3xl font-bold ${
          darkMode ? "text-white" : "text-black"
        }`}
      >
        Dashboard de Metas
      </h1>
      <div className="grid md:grid-cols-3 gap-4">
        {statusData.map((status) => (
          <div
            key={status.name}
            className={`p-4 rounded-xl shadow space-y-1 ${
              darkMode ? "bg-gray-700" : "bg-white"
            }`}
          >
            <h2 className="text-xl font-semibold capitalize">{status.name}</h2>
            <p>Total: {status.value}</p>
            <p>Porcentaje: {status.percentage}%</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div
          className={`h-90 rounded-2xl shadow p-4 ${
            darkMode ? "bg-gray-700" : "bg-white"
          }`}
        >
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

        <div
          className={`h-90 rounded-2xl shadow p-4 ${
            darkMode ? "bg-gray-700" : "bg-white"
          }`}
        >
          <h2 className="text-lg font-bold mb-2">Progreso de Metas (%)</h2>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart data={chartData}>
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

      <div>
        <h2
          className={`text-xl font-bold mb-4 ${
            darkMode ? "text-white" : "text-black"
          }`}
        >
          Detalle de Metas
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          {goalsData.map((goal) => (
            <div
              key={goal.goal_id}
              className={`p-4 rounded-xl shadow space-y-1 relative ${
                darkMode ? "bg-gray-700" : "bg-white"
              }`}
            >
              <button
                onClick={() =>
                  console.log(`Generar PDF para meta: ${goal.goal_name}`)
                }
                className={`absolute top-4 right-4 px-3 py-1 text-sm font-medium rounded-md ${
                  darkMode
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-100 hover:bg-blue-200 text-blue-800"
                } transition-colors duration-200 shadow-sm`}
                title="Generar PDF"
              >
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
    </div>
  );
};

export default Report;
