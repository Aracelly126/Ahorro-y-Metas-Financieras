import React, { useState } from "react";

const GoalForm = ({ onClose, onSave }) => {
  const [goalData, setGoalData] = useState({
    name: "",
    targetAmount: "",
    initialAmount: "",
  });

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
      id: Date.now(),
      name: goalData.name,
      saved: parseFloat(goalData.initialAmount) || 0,
      total: parseFloat(goalData.targetAmount),
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
          <h2 className="text-2xl font-bold text-blue-700">
            Nueva Meta de Ahorro
          </h2>
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
              name="name"
              value={goalData.name}
              onChange={handleChange}
              placeholder="Ej: Casa nueva"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Monto objetivo */}
          <div>
            <label className="block text-sm text-blue-600 font-medium mb-1">
              Monto objetivo
            </label>
            <input
              type="number"
              name="targetAmount"
              value={goalData.targetAmount}
              onChange={handleChange}
              placeholder="Ej: 10000"
              min="1"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Ahorro inicial */}
          <div>
            <label className="block text-sm text-blue-600 font-medium mb-1">
              Ahorro inicial (opcional)
            </label>
            <input
              type="number"
              name="initialAmount"
              value={goalData.initialAmount}
              onChange={handleChange}
              placeholder="Ej: 500"
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

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
