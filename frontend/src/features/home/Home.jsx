// src/pages/Home/Home.jsx
import { useState } from "react";
// import SavingsGoals from "../SavingsGoals/SavingsGoals";
// import Reports from "../Reports/Reports";
// import Profile from "../Profile/Profile";
import Login from "../login/Login";

const Home = () => {
  const [activeSection, setActiveSection] = useState("login");

  const renderContent = () => {
    switch (activeSection) {
      case "login":
        return <Login />;
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
              onClick={() => setActiveSection("login")}
            >
              Metas de Ahorro
            </li>
            <li
              className={`p-3 rounded-lg hover:bg-indigo-600 transition duration-200 cursor-pointer ${
                activeSection === "reports" ? "bg-indigo-700" : ""
              }`}
              onClick={() => setActiveSection("")}
            >
              Reportes
            </li>
            <li
              className={`p-3 rounded-lg hover:bg-indigo-600 transition duration-200 cursor-pointer ${
                activeSection === "profile" ? "bg-indigo-700" : ""
              }`}
              onClick={() => setActiveSection("")}
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
