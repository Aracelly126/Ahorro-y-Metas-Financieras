// src/pages/GoalDetail/GoalDetail.jsx
const GoalDetail = ({ goal, onBack }) => {
    return (
      <div className="p-6 max-w-3xl mx-auto">
        <button
          onClick={onBack}
          className="mb-4 text-blue-600 hover:underline"
        >
          ← Volver
        </button>
        <h2 className="text-2xl font-bold mb-2">{goal.name}</h2>
        <p>Ahorrado: ${goal.saved}</p>
        <p>Total: ${goal.total}</p>
        <p>Progreso: {((goal.saved / goal.total) * 100).toFixed(1)}%</p>
      </div>
    );
  };
  
  export default GoalDetail;
  