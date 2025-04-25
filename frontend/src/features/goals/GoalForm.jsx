import React, { useEffect, useState } from "react";
import { getCategories } from "./categoryService";
import { FaTimes, FaPiggyBank, FaDollarSign, FaCalendarAlt, FaTag } from "react-icons/fa";

const GoalForm = ({ onClose, onSave, initialData }) => {
  const [goalData, setGoalData] = useState({
    goal_name: "",
    target_amount: "",
    deadline_date: "",
    category_id: "",
    user_id: "",
  });

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar datos iniciales si estamos editando
  useEffect(() => {
    if (initialData) {
      setGoalData({
        goal_name: initialData.goal_name || "",
        target_amount: initialData.target_amount || "",
        deadline_date: initialData.deadline_date?.split('T')[0] || "",
        category_id: initialData.category_id || "",
        user_id: initialData.user_id || "",
        goal_id: initialData.goal_id || "",
      });
    }
  }, [initialData]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error cargando categorías:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newGoal = {
      ...goalData,
      target_amount: parseFloat(goalData.target_amount),
    };
    onSave(newGoal);
  };

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-700">Cargando formulario...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gray-900/30 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="relative w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <FaPiggyBank className="text-white text-xl" />
              <h2 className="text-xl font-bold text-white">
                {initialData ? "Editar Meta" : "Nueva Meta de Ahorro"}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
          <p className="text-blue-100 text-sm mt-1">
            {initialData ? "Actualiza los detalles de tu meta" : "Define tu meta y empieza a ahorrar hoy"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Nombre de la meta */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Nombre de la meta
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaPiggyBank className="text-gray-400" />
              </div>
              <input
                type="text"
                name="goal_name"
                value={goalData.goal_name}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="Ej: Vacaciones, Auto nuevo"
                required
              />
            </div>
          </div>

          {/* Monto objetivo */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Monto objetivo
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaDollarSign className="text-gray-400" />
              </div>
              <input
                type="number"
                name="target_amount"
                value={goalData.target_amount}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Fecha límite */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Fecha límite
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaCalendarAlt className="text-gray-400" />
              </div>
              <input
                type="date"
                name="deadline_date"
                value={goalData.deadline_date}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
                min={new Date().toISOString().split('T')[0]}
                required
              />
            </div>
          </div>

          {/* Categoría */}
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Categoría
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaTag className="text-gray-400" />
              </div>
              <select
                name="category_id"
                value={goalData.category_id}
                onChange={handleChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition appearance-none"
                required
              >
                <option value="">Seleccione una categoría</option>
                {categories.map((cat) => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ID de usuario (oculto) */}
          <input 
            type="hidden" 
            name="user_id" 
            value={goalData.user_id} 
            onChange={handleChange}
          />

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors font-medium shadow-sm"
            >
              {initialData ? "Actualizar Meta" : "Crear Meta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalForm;
