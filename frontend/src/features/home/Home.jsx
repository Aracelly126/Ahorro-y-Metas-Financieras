import { useState } from "react";
import ListGoals from "../goals/listGoals"; // Ajusta el path según tu estructura
import GoalDetail from "../contributions/GoalDetail";

const Home = () => {
  const [activeSection, setActiveSection] = useState("login");
  const [selectedGoal, setSelectedGoal] = useState(null);

  const renderContent = () => {
    if (selectedGoal) {
      return (
        <GoalDetail
          goal={selectedGoal}
          onBack={() => setSelectedGoal(null)}
        />
      );
    }

    switch (activeSection) {
      case "goals":
        return <ListGoals onGoalClick={(goal) => setSelectedGoal(goal)} />;
      default:
        return <div>Sección no implementada</div>;
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-600 text-white p-4 flex flex-col">
        <div className="mb-8 mt-4">
          <h2 className="text-2xl font-bold">Menú</h2>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            <li
              className={`p-3 rounded-lg hover:bg-indigo-600 transition duration-200 cursor-pointer ${
                activeSection === "savings" ? "bg-indigo-700" : ""
              }`}
              onClick={() => {
                setActiveSection("goals");
                setSelectedGoal(null); // Reinicia detalle
              }}
            >
              Metas de Ahorro
            </li>
            <li
              className={`p-3 rounded-lg hover:bg-indigo-600 transition duration-200 cursor-pointer ${
                activeSection === "reports" ? "bg-indigo-700" : ""
              }`}
              onClick={() => setActiveSection("reports")}
            >
              Reportes
            </li>
            <li
              className={`p-3 rounded-lg hover:bg-indigo-600 transition duration-200 cursor-pointer ${
                activeSection === "profile" ? "bg-indigo-700" : ""
              }`}
              onClick={() => setActiveSection("profile")}
            >
              Perfil
            </li>
          </ul>
        </nav>

        <div className="mt-auto p-3 text-sm text-indigo-200">© 2025 Mi App</div>
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto">{renderContent()}</div>
      </div>
    </div>
  );
};

export default Home;
