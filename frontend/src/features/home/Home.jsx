import { useState } from "react";
import ListGoals from "../goals/listGoals";
import GoalDetail from "../contributions/GoalDetail";
import {
  FaPiggyBank,
  FaChartBar,
  FaUser,
  FaSun,
  FaMoon,
  FaUserCircle,
  FaBell,
  FaSignOutAlt,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Profile from "../profile/profile";
import Report from "../reports/report";

const Home = () => {
  const [activeSection, setActiveSection] = useState("goals");
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const { auth, logout } = useAuth();
  const navigate = useNavigate();
  const user = auth?.usuario;
  const foto = user?.user_foto_url;

  // Datos de ejemplo para notificaciones
  const [notifications] = useState([
    {
      id: 1,
      title: "Nueva meta alcanzada",
      message: "Has completado tu meta de ahorro para vacaciones",
      time: "2h ago",
      read: false,
    },
    {
      id: 2,
      title: "Recordatorio de pago",
      message: "Tu aporte mensual vence en 3 días",
      time: "1d ago",
      read: true,
    },
    {
      id: 3,
      title: "Bienvenida",
      message: "¡Bienvenido a nuestra cooperativa!",
      time: "1 semana ago",
      read: true,
    },
  ]);

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const renderContent = () => {
    if (selectedGoal) {
      return (
        <GoalDetail goal={selectedGoal} onBack={() => setSelectedGoal(null)} />
      );
    }

    switch (activeSection) {
      case "goals":
        return (
          <ListGoals
            onGoalClick={(goal) => setSelectedGoal(goal)}
            darkMode={darkMode}
          />
        );
      case "report":
        return <Report darkMode={darkMode} />;
      case "profile":
        return <Profile darkMode={darkMode} />;
      default:
        return (
          <div className="p-6 bg-white rounded-lg shadow">
            Sección no implementada
          </div>
        );
    }
  };

  return (
    <div
      className={`flex h-screen ${
        darkMode ? "bg-gray-800 text-white" : "bg-gray-100 text-gray-900"
      }`}
    >
      {/* Sidebar */}
      <div
        className={`w-64 ${
          darkMode ? "bg-blue-900" : "bg-blue-600"
        } text-white p-4 flex flex-col transition-colors duration-300`}
      >
        {/* Logo Cooperativa */}
        <div className="flex justify-center mb-6 mt-4">
          <div className="flex items-center justify-center w-48 h-16">
            <div className="flex items-center">
              <div className="bg-white text-blue-600 rounded-full p-2 mr-3">
                <FaPiggyBank className="text-2xl" />
              </div>
              <span className="text-xl font-bold">COOP AHORRO</span>
            </div>
          </div>
        </div>

        {/* Perfil de usuario */}
        <div className="mb-8 flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
            {foto ? (
              <img
                src={foto}
                alt="Profile"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "";
                  e.target.parentElement.classList.add(
                    "text-blue-600",
                    "text-4xl"
                  );
                }}
              />
            ) : (
              <FaUserCircle className="text-blue-600 text-4xl" />
            )}
          </div>
          <h3 className="font-semibold mt-3 text-center">
            {user?.user_nombre || "Usuario"} {user?.user_apellido || ""}
          </h3>
          <p className="text-sm text-blue-200">
            Socio desde: {new Date().getFullYear()}
          </p>
        </div>

        {/* Menú de navegación */}
        <nav className="flex-1">
          <ul className="space-y-1">
            <li
              className={`flex items-center p-3 rounded-lg transition duration-200 cursor-pointer ${
                activeSection === "goals"
                  ? darkMode
                    ? "bg-blue-700"
                    : "bg-blue-800"
                  : darkMode
                  ? "hover:bg-blue-800"
                  : "hover:bg-blue-700"
              }`}
              onClick={() => {
                setActiveSection("goals");
                setSelectedGoal(null);
              }}
            >
              <FaPiggyBank className="mr-3 text-lg" />
              <span>Metas de Ahorro</span>
            </li>

            <li
              className={`flex items-center p-3 rounded-lg transition duration-200 cursor-pointer ${
                activeSection === "reports"
                  ? darkMode
                    ? "bg-blue-700"
                    : "bg-blue-800"
                  : darkMode
                  ? "hover:bg-blue-800"
                  : "hover:bg-blue-700"
              }`}
              onClick={() => setActiveSection("report")}
            >
              <FaChartBar className="mr-3 text-lg" />
              <span>Reportes</span>
            </li>

            <li
              className={`flex items-center p-3 rounded-lg transition duration-200 cursor-pointer ${
                activeSection === "profile"
                  ? darkMode
                    ? "bg-blue-700"
                    : "bg-blue-800"
                  : darkMode
                  ? "hover:bg-blue-800"
                  : "hover:bg-blue-700"
              }`}
              onClick={() => setActiveSection("profile")}
            >
              <FaUser className="mr-3 text-lg" />
              <span>Perfil</span>
            </li>
          </ul>
        </nav>

        {/* Configuración y cerrar sesión */}
        <div className="mt-auto space-y-3">
          <div
            className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-blue-700 transition duration-200"
            onClick={() => setDarkMode(!darkMode)}
          >
            <div className="flex items-center">
              {darkMode ? (
                <FaSun className="mr-3 text-lg" />
              ) : (
                <FaMoon className="mr-3 text-lg" />
              )}
              <span>Modo {darkMode ? "Claro" : "Oscuro"}</span>
            </div>
            <div
              className={`w-10 h-5 ${
                darkMode ? "bg-blue-700" : "bg-blue-800"
              } rounded-full flex items-center p-1`}
            >
              <div
                className={`w-3 h-3 bg-white rounded-full transition-transform duration-200 ${
                  darkMode ? "transform translate-x-5" : ""
                }`}
              ></div>
            </div>
          </div>

          <div
            className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-blue-700 transition duration-200"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="mr-3 text-lg" />
            <span>Cerrar sesión</span>
          </div>
        </div>
      </div>

      {/* Área de contenido principal */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Barra superior con notificaciones */}
        <header
          className={`flex justify-between items-center p-4 ${
            darkMode ? "bg-gray-700" : "bg-white"
          } shadow-sm`}
        >
          <h1 className="text-xl font-semibold">
            {activeSection === "goals" && "Mis Metas de Ahorro"}
            {activeSection === "reports" && "Reportes"}
            {activeSection === "profile" && "Mi Perfil"}
          </h1>
        </header>

        {/* Contenido principal */}
        <main className="flex-1 overflow-auto p-6">
          <div className="max-w-6xl mx-auto">{renderContent()}</div>
        </main>
      </div>
    </div>
  );
};

export default Home;
