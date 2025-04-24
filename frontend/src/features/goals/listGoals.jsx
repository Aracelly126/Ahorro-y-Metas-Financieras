import React, { useState } from "react";
import GoalForm from "../../shared/components/GoalForm"; // Asumiendo que GoalForm está en otro archivo

const initialGoals = [
  {
    id: 1,
    name: "Viaje a Japón",
    saved: 500,
    total: 2000
  },
  {
    id: 6,
    name: "Viaje a Japón",
    saved: 500,
    total: 2000
  },
  {
    id: 7,
    name: "Viaje a Japón",
    saved: 500,
    total: 2000
  },
  {
    id: 8,
    name: "Viaje a Japón",
    saved: 500,
    total: 2000
  },
  {
    id: 2,
    name: "Laptop nueva",
    saved: 800,
    total: 1200
  },
  {
    id: 3,
    name: "Fondo de emergencia",
    saved: 1500,
    total: 3000
  }
];

const ListGoals = ({ onGoalClick }) => {
  const [goals, setGoals] = useState(initialGoals);
  const [showGoalForm, setShowGoalForm] = useState(false);

  const handleAddNewGoal = (newGoal) => {
    setGoals([...goals, newGoal]);
    setShowGoalForm(false);
  };

  return (
    <div className="relative">
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Mis Metas de Ahorro</h2>
          <button
            onClick={() => setShowGoalForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Nueva Meta
          </button>
        </div>
        
        <div className="space-y-4">
          {goals.map((goal) => {
            const percentage = Math.min((goal.saved / goal.total) * 100, 100);
            return (
              <div
                key={goal.id}
                className="p-4 bg-white shadow rounded-xl cursor-pointer hover:shadow-lg transition"
                onClick={() => onGoalClick(goal)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{goal.name}</h3>
                  <span className="text-sm text-gray-500">
                    ${goal.saved} / ${goal.total}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                <div className="text-right text-sm mt-1 text-gray-600">
                  {percentage.toFixed(1)}%
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal para agregar nueva meta */}
      {showGoalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <GoalForm 
            onClose={() => setShowGoalForm(false)}
            onSave={handleAddNewGoal}
          />
        </div>
      )}
    </div>
  );
};

export default ListGoals;