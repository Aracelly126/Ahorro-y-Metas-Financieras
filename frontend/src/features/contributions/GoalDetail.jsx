// src/pages/GoalDetail/GoalDetail.jsx
import { useState } from 'react';

const GoalDetail = ({ goal, onBack }) => {
  const [contributions, setContributions] = useState([
    { id: 1, goalId: 1, amount: 100, date: "2023-01-15", contributor: "Juan" },
    { id: 2, goalId: 1, amount: 150, date: "2023-02-20", contributor: "María" },
    // ... otras contribuciones
  ]);

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    contributor: '',
    date: new Date().toISOString().split('T')[0]
  });

  const goalContributions = contributions.filter((c) => c.goalId === goal.id);
  const totalContributed = goalContributions.reduce((sum, c) => sum + c.amount, 0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newContribution = {
      id: Math.max(...contributions.map(c => c.id), 0) + 1,
      goalId: goal.id,
      amount: Number(formData.amount),
      contributor: formData.contributor,
      date: formData.date
    };
    
    setContributions(prev => [...prev, newContribution]);
    setFormData({ amount: '', contributor: '', date: new Date().toISOString().split('T')[0] });
    setShowModal(false);
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* Header con botón de volver y agregar */}
      <div className="flex justify-between items-center mb-4">
        <button onClick={onBack} className="text-blue-600 hover:underline">
          ← Volver
        </button>
        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          + Agregar Contribución
        </button>
      </div>

      {/* Información de la meta */}
      <h2 className="text-2xl font-bold mb-2">{goal.name}</h2>
      
      {/* Sección de progreso */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <div className="flex justify-between mb-1">
          <p>Ahorrado: ${goal.saved}</p>
          <p>Total: ${goal.total}</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-blue-600 h-2.5 rounded-full"
            style={{ width: `${(goal.saved / goal.total) * 100}%` }}
          ></div>
        </div>
        <p className="mt-1 text-sm text-gray-600">
          Progreso: {((goal.saved / goal.total) * 100).toFixed(1)}% •
          Contribuciones totales: ${totalContributed}
        </p>
      </div>

      {/* Sección de contribuciones */}
      <div>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xl font-semibold">Contribuciones</h3>
          <span className="text-sm text-gray-500">
            {goalContributions.length} registros
          </span>
        </div>

        {goalContributions.length === 0 ? (
          <div className="text-center py-8 border rounded-lg bg-gray-50">
            <p className="text-gray-500 mb-3">No hay contribuciones registradas.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {goalContributions.map((contribution) => (
              <div
                key={contribution.id}
                className="p-3 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex justify-between">
                  <span className="font-medium">
                    {contribution.contributor}
                  </span>
                  <span className="text-blue-600">+${contribution.amount}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-500">
                  <span>
                    {new Date(contribution.date).toLocaleDateString()}
                  </span>
                  <span>#{contribution.id}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para agregar contribución */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold">Nueva Contribución</h3>
              <button 
                onClick={() => setShowModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Cantidad
                </label>
                <input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                  min="1"
                  step="0.01"
                  placeholder="Ej: 150.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contribuidor
                </label>
                <input
                  type="text"
                  name="contributor"
                  value={formData.contributor}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalDetail;