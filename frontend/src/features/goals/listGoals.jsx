import React, { useState, useEffect } from "react";
import GoalForm from "./GoalForm";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from "../goals/goalService";
import { getContributions } from "../contributions/contributionService";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaChartLine,
  FaMoneyBillWave,
} from "react-icons/fa";

const ListGoals = ({ onGoalClick, darkMode }) => {
  const [goals, setGoals] = useState([]);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [contributionsByGoal, setContributionsByGoal] = useState({});
  const [editingGoal, setEditingGoal] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
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
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const calculateTotalContributions = (goalId) => {
    const contributions = contributionsByGoal[goalId] || [];
    return contributions.reduce(
      (sum, contribution) => sum + Number(contribution.amount),
      0
    );
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
    if (darkMode) {
      switch (status) {
        case "Completada":
          return "bg-green-900 text-green-200 border-green-700";
        case "Vencida":
          return "bg-red-900 text-red-200 border-red-700";
        case "En riesgo":
          return "bg-yellow-900 text-yellow-200 border-yellow-700";
        case "Bien encaminada":
          return "bg-blue-900 text-blue-200 border-blue-700";
        default:
          return "bg-gray-700 text-gray-200 border-gray-600";
      }
    } else {
      switch (status) {
        case "Completada":
          return "bg-green-100 text-green-800 border-green-200";
        case "Vencida":
          return "bg-red-100 text-red-800 border-red-200";
        case "En riesgo":
          return "bg-yellow-100 text-yellow-800 border-yellow-200";
        case "Bien encaminada":
          return "bg-blue-100 text-blue-800 border-blue-200";
        default:
          return "bg-gray-100 text-gray-800 border-gray-200";
      }
    }
  };

  const handleAddNewGoal = async (newGoal) => {
    try {
      const createdGoal = await createGoal(newGoal);
      setGoals([...goals, createdGoal]);
      setShowGoalForm(false);
      setContributionsByGoal((prev) => ({
        ...prev,
        [createdGoal.goal_id]: [],
      }));
    } catch (error) {
      console.error("Error al agregar la meta:", error);
    }
  };

  const handleUpdateGoal = async (updatedGoal) => {
    if (!updatedGoal.goal_id) {
      console.error("La goal_id es necesaria para la actualización.");
      return;
    }

    try {
      const result = await updateGoal(updatedGoal.goal_id, updatedGoal);
      setGoals(
        goals.map((g) => (g.goal_id === updatedGoal.goal_id ? result : g))
      );
      setEditingGoal(null);
      window.location.reload();
    } catch (error) {
      console.error("Error al actualizar la meta:", error);
    }
  };

  const handleDeleteGoal = async (goalId) => {
    try {
      await deleteGoal(goalId);
      setGoals(goals.filter((g) => g.goal_id !== goalId));
    } catch (error) {
      console.error("Error al eliminar la meta:", error);
    }
  };

  const filteredGoals = goals.filter((goal) => {
    if (statusFilter === "all") return true;
    const totalContributions = calculateTotalContributions(goal.goal_id);
    const status = getGoalStatus(goal, totalContributions);
    return status === statusFilter;
  });

  const handleCardClick = (goal, e) => {
    if (e.target.closest("button")) {
      return;
    }
    onGoalClick(goal);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div
          className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${
            darkMode ? "border-blue-400" : "border-blue-500"
          }`}
        ></div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="p-6 max-w-4xl mx-auto">
        <div
          className={`flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 ${
            darkMode ? "text-white" : "text-gray-800"
          }`}
        >
          <div>
            <h2
              className={`text-2xl font-bold ${
                darkMode ? "text-white" : "text-gray-800"
              }`}
            >
              Mis Metas de Ahorro
            </h2>

            <p className={darkMode ? "text-gray-300" : "text-gray-600"}>
              Administra tus objetivos financieros
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="flex-1 sm:w-48">
              <label
                className={`block text-sm font-medium mb-1 ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Filtrar por estado:
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition ${
                  darkMode
                    ? "bg-gray-700 border-gray-600 text-white"
                    : "bg-white border-gray-300 text-gray-700"
                }`}
              >
                <option value="all">Todas las metas</option>
                <option value="Completada">Completadas</option>
                <option value="Bien encaminada">Bien encaminadas</option>
                <option value="En progreso">En progreso</option>
                <option value="En riesgo">En riesgo</option>
                <option value="Vencida">Vencidas</option>
              </select>
            </div>

            <button
              onClick={() => {
                setEditingGoal(null);
                setShowGoalForm(true);
              }}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              <FaPlus /> Nueva Meta
            </button>
          </div>
        </div>

        {filteredGoals.length === 0 ? (
          <div
            className={`text-center py-12 rounded-xl shadow-sm border border-dashed ${
              darkMode
                ? "bg-gray-800 border-gray-600"
                : "bg-white border-gray-300"
            }`}
          >
            <FaMoneyBillWave
              className={`mx-auto text-4xl mb-4 ${
                darkMode ? "text-gray-500" : "text-gray-400"
              }`}
            />
            <h3
              className={`text-lg font-medium ${
                darkMode ? "text-white" : "text-gray-900"
              }`}
            >
              No hay metas registradas
            </h3>
            <p
              className={`mt-1 text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Comienza creando tu primera meta de ahorro
            </p>
            <button
              onClick={() => setShowGoalForm(true)}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Crear mi primera meta
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredGoals.map((goal) => {
              const totalContributions = calculateTotalContributions(
                goal.goal_id
              );
              const percentage = Math.min(
                (totalContributions / goal.target_amount) * 100,
                100
              );
              const status = getGoalStatus(goal, totalContributions);
              const statusColor = getStatusColor(status);

              return (
                <div
                  key={goal.goal_id}
                  className={`p-5 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer border ${
                    darkMode
                      ? "bg-gray-800 border-gray-700 hover:bg-gray-700"
                      : "bg-white border-gray-100 hover:bg-gray-50"
                  }`}
                  onClick={(e) => handleCardClick(goal, e)}
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3
                        className={`text-lg font-semibold ${
                          darkMode ? "text-white" : "text-gray-800"
                        }`}
                      >
                        {goal.goal_name}
                      </h3>
                      <p
                        className={darkMode ? "text-gray-400" : "text-gray-500"}
                      >
                        {new Date(goal.deadline_date).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full ${statusColor} border`}
                    >
                      {status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span
                        className={`text-sm font-medium ${
                          darkMode ? "text-gray-300" : "text-gray-700"
                        }`}
                      >
                        $
                        {totalContributions
                          ? totalContributions.toLocaleString("es-MX")
                          : "0"}{" "}
                        de $
                        {goal.target_amount
                          ? goal.target_amount.toLocaleString("es-MX")
                          : "No disponible"}
                      </span>
                      <span
                        className={`text-sm font-medium ${
                          darkMode ? "text-blue-400" : "text-blue-600"
                        }`}
                      >
                        {isNaN(percentage) ? "0.0" : percentage.toFixed(1)}%
                      </span>
                    </div>

                    <div
                      className={`w-full rounded-full h-2.5 overflow-hidden ${
                        darkMode ? "bg-gray-700" : "bg-gray-200"
                      }`}
                    >
                      <div
                        className={`h-full bg-gradient-to-r transition-all duration-500 ${
                          darkMode
                            ? "from-blue-400 to-blue-500"
                            : "from-blue-500 to-blue-600"
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onGoalClick(goal);
                        }}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-opacity-20 transition text-sm ${
                          darkMode
                            ? "bg-blue-900 bg-opacity-30 text-blue-300 hover:bg-blue-800"
                            : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                        }`}
                        title="Ver contribuciones"
                      >
                        <FaChartLine size={14} /> Ver
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingGoal(goal);
                          setShowGoalForm(true);
                        }}
                        className={`flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-opacity-20 transition text-sm ${
                          darkMode
                            ? "bg-yellow-900 bg-opacity-30 text-yellow-300 hover:bg-yellow-800"
                            : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                        }`}
                        title="Editar meta"
                      >
                        <FaEdit size={14} /> Editar
                      </button>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          window.confirm("¿Estás seguro de eliminar esta meta?")
                        ) {
                          handleDeleteGoal(goal.goal_id);
                        }
                      }}
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-opacity-20 transition text-sm ${
                        darkMode
                          ? "bg-red-900 bg-opacity-30 text-red-300 hover:bg-red-800"
                          : "bg-red-50 text-red-700 hover:bg-red-100"
                      }`}
                    >
                      <FaTrash size={14} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showGoalForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div
            className={`rounded-xl shadow-xl w-full max-w-md ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div
              className={`flex justify-between items-center p-5 border-b ${
                darkMode ? "border-gray-700" : "border-gray-200"
              }`}
            >
              <h3
                className={`text-xl font-bold ${
                  darkMode ? "text-white" : "text-gray-800"
                }`}
              >
                {editingGoal ? "Editar Meta" : "Nueva Meta de Ahorro"}
              </h3>
              <button
                onClick={() => {
                  setShowGoalForm(false);
                  setEditingGoal(null);
                }}
                className={
                  darkMode
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-400 hover:text-gray-600"
                }
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="p-5">
              <GoalForm
                onClose={() => {
                  setShowGoalForm(false);
                  setEditingGoal(null);
                }}
                onSave={editingGoal ? handleUpdateGoal : handleAddNewGoal}
                initialData={editingGoal}
                darkMode={darkMode}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ListGoals;
