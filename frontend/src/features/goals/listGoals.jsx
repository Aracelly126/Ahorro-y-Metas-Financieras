import React, { useState, useEffect } from "react";
import GoalForm from "./GoalForm";
import { getGoals, createGoal } from "../goals/goalService";
import { getContributions } from "../contributions/contributionService"; // Importamos el servicio de contribuciones

const ListGoals = ({ onGoalClick }) => {
  const [goals, setGoals] = useState([]);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [contributionsByGoal, setContributionsByGoal] = useState({}); // Objeto para almacenar contribuciones por goal_id

  // Cargar las metas y sus contribuciones
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Obtener todas las metas
        const goalsData = await getGoals();
        setGoals(goalsData);

        // 2. Para cada meta, obtener sus contribuciones
        const contributionsMap = {};
        await Promise.all(
          goalsData.map(async (goal) => {
            const contributions = await getContributions(goal.goal_id);
            contributionsMap[goal.goal_id] = contributions;
          })
        );
        setContributionsByGoal(contributionsMap);
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
    };

    fetchData();
  }, []);

  // Función para calcular el total aportado a una meta
  const calculateTotalContributions = (goalId) => {
    const contributions = contributionsByGoal[goalId] || [];
    return contributions.reduce((sum, contribution) => sum + Number(contribution.amount), 0);
  };

  const handleAddNewGoal = async (newGoal) => {
    try {
      const createdGoal = await createGoal(newGoal);
      setGoals([...goals, createdGoal]);
      setShowGoalForm(false);
      // Inicializar array de contribuciones vacío para la nueva meta
      setContributionsByGoal(prev => ({
        ...prev,
        [createdGoal.goal_id]: []
      }));
    } catch (error) {
      console.error("Error al agregar la meta:", error);
    }
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
            const totalContributions = calculateTotalContributions(goal.goal_id);
            const percentage = Math.min((totalContributions / goal.target_amount) * 100, 100);
            
            return (
              <div
                key={goal.goal_id}
                className="p-4 bg-white shadow rounded-xl cursor-pointer hover:shadow-lg transition"
                onClick={() => onGoalClick(goal)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{goal.goal_name}</h3>
                  <span className="text-sm text-gray-500">
                    ${totalContributions.toFixed(2)} / ${goal.target_amount}
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