import React, { useEffect, useState } from "react";
import { getCategories } from "./categoryService";

const GoalForm = ({ onClose, onSave }) => {
  const [goalData, setGoalData] = useState({
    goal_name: "",
    target_amount: "",
    deadline_date: "",
    category_id: "",
    user_id: "",
  });

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();
        setCategories(data);
      } catch (error) {
        console.error("Error cargando categorías:", error);
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
      goal_name: goalData.goal_name,
      target_amount: parseFloat(goalData.target_amount),
      deadline_date: goalData.deadline_date,
      category_id: goalData.category_id,
      user_id: goalData.user_id,
    };

    onSave(newGoal);
  };

  return (
    <div className="fixed inset-0 bg-sky-100/20 backdrop-blur-[3px] flex items-center justify-center p-4 z-50">
      <div className="relative w-full max-w-lg bg-white/80 backdrop-blur-[4px] rounded-2xl shadow-xl p-8 border-t-8 border-blue-600/80">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-blue-500 hover:text-blue-700 text-lg"
        >
          ✕
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-blue-700">Nueva Meta de Ahorro</h2>
          <p className="text-sm text-gray-500 mt-1">
            Define tu meta y empieza a ahorrar hoy
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Nombre de la meta */}
          <div>
            <label className="block text-sm text-blue-600 font-medium mb-1">
              Nombre de la meta
            </label>
            <input
              type="text"
              name="goal_name"
              value={goalData.goal_name}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Ej: Vacaciones, Auto nuevo"
              required
            />
          </div>

          {/* Monto objetivo */}
          <div>
            <label className="block text-sm text-blue-600 font-medium mb-1">
              Monto objetivo
            </label>
            <div className="relative">
              <span className="absolute left-3 top-2 text-gray-400">$</span>
              <input
                type="number"
                name="target_amount"
                value={goalData.target_amount}
                onChange={handleChange}
                className="w-full pl-8 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          {/* Fecha límite */}
          <div>
            <label className="block text-sm text-blue-600 font-medium mb-1">
              Fecha límite
            </label>
            <input
              type="date"
              name="deadline_date"
              value={goalData.deadline_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              min={new Date().toISOString().split('T')[0]}
              required
            />
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm text-blue-600 font-medium mb-1">
              Categoría
            </label>
            <select
              name="category_id"
              value={goalData.category_id}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
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

          {/* ID de usuario (oculto si se maneja automáticamente) */}
          <input 
            type="hidden" 
            name="user_id" 
            value={goalData.user_id} 
            onChange={handleChange}
          />

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md border border-blue-200 text-blue-600 hover:bg-blue-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Crear Meta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GoalForm;