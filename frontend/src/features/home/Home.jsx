import { useState } from "react";
import ListGoals from "../goals/listGoals";
import GoalDetail from "../contributions/GoalDetail";
import { FaPiggyBank, FaChartBar, FaUser, FaSun, FaMoon,FaUserCircle } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

const Home = () => {
  const [activeSection, setActiveSection] = useState("login");
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const { auth } = useAuth(); // Obtener usuario del contexto de autenticación
  const user = auth?.usuario;
  const foto = user?.user_foto_url;

  const renderContent = () => {
    if (selectedGoal) {
      return (
        <GoalDetail goal={selectedGoal} onBack={() => setSelectedGoal(null)} />
      );
    }

    switch (activeSection) {
      case "goals":
        return <ListGoals onGoalClick={(goal) => setSelectedGoal(goal)} />;
      case "reports":
        return <div>Reportes</div>;
      case "profile":
        return <div>Perfil</div>;
      default:
        return <div>Sección no implementada</div>;
    }
  };

  return (
    <div className={`flex h-screen ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
      {/* Sidebar con iconos */}
      <div className={`w-64 ${darkMode ? "bg-blue-900" : "bg-blue-600"} text-white p-4 flex flex-col`}>
        {/* Encabezado con usuario */}
        <div className="mb-2 mt-4 flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden">
          {foto ? (
         <img 
          src={foto} 
          alt="Profile" 
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '';
            e.target.parentElement.classList.add('text-blue-600', 'text-4xl');
          }}
          />
          ) : (
          <FaUserCircle className="text-blue-600 text-4xl" />
        )}

          </div>
          <h3 className="font-semibold mt-2">
            {user?.user_nombre || 'Usuario'} {user?.user_apellido || ''}
          </h3>
          <p className="text-sm text-blue-200">Ahorrador</p>
        </div>

        {/* Resto del sidebar... */}
        <nav className="flex-1 mt-8">
          <ul className="space-y-2">
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
              <FaPiggyBank className="mr-3" />
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
              onClick={() => setActiveSection("reports")}
            >
              <FaChartBar className="mr-3" />
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
              <FaUser className="mr-3" />
              <span>Perfil</span>
            </li>
          </ul>
        </nav>

        <div className="mt-auto p-3">
          <div
            className="flex items-center justify-between p-2 rounded-lg cursor-pointer hover:bg-blue-700 transition duration-200"
            onClick={() => setDarkMode(!darkMode)}
          >
            <div className="flex items-center">
              {darkMode ? (
                <FaSun className="mr-3" />
              ) : (
                <FaMoon className="mr-3" />
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
        </div>
      </div>

      {/* Área de contenido */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Home;