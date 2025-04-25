import React, { useState, useEffect } from "react";
import GoalForm from "./GoalForm";
import { getGoals, createGoal, updateGoal, deleteGoal } from "../goals/goalService";
import { getContributions } from "../contributions/contributionService";

const ListGoals = ({ onGoalClick }) => {
  const [goals, setGoals] = useState([]);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [contributionsByGoal, setContributionsByGoal] = useState({});
  const [editingGoal, setEditingGoal] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const goalsData = await getGoals();
        setGoals(goalsData);

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

  const calculateTotalContributions = (goalId) => {
    const contributions = contributionsByGoal[goalId] || [];
    return contributions.reduce((sum, contribution) => sum + Number(contribution.amount), 0);
  };

  const isGoalAtRisk = (goal, totalContributions) => {
    const start = new Date(goal.created_at);
    const end = new Date(goal.deadline_date);
    const now = new Date();
  
    const totalWeeks = (end - start) / (7 * 24 * 60 * 60 * 1000);
    const remainingWeeks = (end - now) / (7 * 24 * 60 * 60 * 1000);
  
    if (remainingWeeks <= 0) return true;
  
    const originalWeeklyRate = goal.target_amount / totalWeeks;
    const remainingAmount = goal.target_amount - totalContributions;
    const requiredWeeklyRate = remainingAmount / remainingWeeks;
  
    return requiredWeeklyRate > originalWeeklyRate * 2;
  };

  const getGoalStatus = (goal, totalContributions) => {
    const now = new Date();
    const endDate = new Date(goal.deadline_date);
    const percentage = (totalContributions / goal.target_amount) * 100;

    if (percentage >= 100) return "Completada";
    if (now > endDate) return "Vencida";
    if (percentage >= 70) return "Bien encaminada";
    if (isGoalAtRisk(goal, totalContributions)) return "En riesgo";
    return "En progreso";
  };

  const getStatusColor = (status) => {
    switch(status) {
      case "Completada": return "bg-green-100 text-green-800";
      case "Vencida": return "bg-red-100 text-red-800";
      case "En riesgo": return "bg-yellow-100 text-yellow-800";
      case "Bien encaminada": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handleAddNewGoal = async (newGoal) => {
    try {
      const createdGoal = await createGoal(newGoal);
      setGoals([...goals, createdGoal]);
      setShowGoalForm(false);
      setContributionsByGoal(prev => ({
        ...prev,
        [createdGoal.goal_id]: []
      }));
    } catch (error) {
      console.error("Error al agregar la meta:", error);
    }
  };

  const handleUpdateGoal = async (updatedGoal) => {
    try {
      const result = await updateGoal(updatedGoal.goal_id, updatedGoal);
      setGoals(goals.map(g => g.goal_id === updatedGoal.goal_id ? result : g));
      setEditingGoal(null);
    } catch (error) {
      console.error("Error al actualizar la meta:", error);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      await deleteGoal(goalId);
      setGoals(goals.filter(g => g.goal_id !== goalId));
    } catch (error) {
      console.error("Error al eliminar la meta:", error);
    }
  };

  const filteredGoals = goals.filter(goal => {
    if (statusFilter === "all") return true;
    const totalContributions = calculateTotalContributions(goal.goal_id);
    const status = getGoalStatus(goal, totalContributions);
    return status === statusFilter;
  });

  // Manejar clic en la tarjeta
  const handleCardClick = (goal, e) => {
    // Verificar si el clic fue en un botón
    if (e.target.tagName === 'BUTTON') {
      return;
    }
    onGoalClick(goal);
  };

  return (
    <div className="relative">
      <div className="p-6 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Mis Metas de Ahorro</h2>
          <button
            onClick={() => {
              setEditingGoal(null);
              setShowGoalForm(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            + Nueva Meta
          </button>
        </div>

        <div className="mb-4">
          <label className="mr-2">Filtrar por estado:</label>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border rounded p-1"
          >
            <option value="all">Todas</option>
            <option value="Completada">Completadas</option>
            <option value="Bien encaminada">Bien encaminadas</option>
            <option value="En progreso">En progreso</option>
            <option value="En riesgo">En riesgo</option>
            <option value="Vencida">Vencidas</option>
          </select>
        </div>

        <div className="space-y-4">
          {filteredGoals.map((goal) => {
            const totalContributions = calculateTotalContributions(goal.goal_id);
            const percentage = Math.min((totalContributions / goal.target_amount) * 100, 100);
            const status = getGoalStatus(goal, totalContributions);
            const statusColor = getStatusColor(status);

            return (
              <div
                key={goal.goal_id}
                className="p-4 bg-white shadow rounded-xl hover:shadow-lg transition cursor-pointer"
                onClick={(e) => handleCardClick(goal, e)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{goal.goal_name}</h3>
                  <span className={`text-xs px-2 py-1 rounded-full ${statusColor}`}>
                    {status}
                  </span>
                </div>
                
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-500">
                    ${totalContributions.toFixed(2)} / ${goal.target_amount}
                  </span>
                  <span className="text-sm text-gray-600">
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
                  <div
                    className="h-full bg-blue-600 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
                
                <div className="flex justify-between">
                  <div className="space-x-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onGoalClick(goal);
                      }}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                    >
                      Ver Contribuciones
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingGoal(goal);
                        setShowGoalForm(true);
                      }}
                      className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200"
                    >
                      Editar
                    </button>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (window.confirm("¿Estás seguro de eliminar esta meta?")) {
                        handleDeleteGoal(goal.goal_id);
                      }
                    }}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {showGoalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">
                {editingGoal ? "Editar Meta" : "Nueva Meta"}
              </h3>
              <button
                onClick={() => {
                  setShowGoalForm(false);
                  setEditingGoal(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <GoalForm
              onClose={() => {
                setShowGoalForm(false);
                setEditingGoal(null);
              }}
              onSave={editingGoal ? handleUpdateGoal : handleAddNewGoal}
              initialData={editingGoal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ListGoals;