// import React from "react";
// const formGoal = ({ goal, onClose }) => {
//   if (!goal) return null;
//   return (
//     <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
//       <h2 className="text-center text-green-600 text-xl font-semibold">
//         AhorroMeta Bienestar
//       </h2>
//       <button
//         className="absolute top-2 right-2 text-gray-500 hover:text-black"
//         onClick={onClose}
//       >
//         ✕
//       </button>
//       <p className="text-center text-orange-500 font-medium mt-1">
//         Planifica los detalles
//       </p>

//       {/* Descripción */}
//       <p className="text-center text-gray-700 text-sm">
//         Obtén una tasa del 5% de interés anual sobre tus ahorros.
//         <br />
//         Podrás disponer de tu dinero cada año o renovar tu ahorro.
//       </p>

//       {/* Inputs */}
//       <div className="mt-6">
//         <label className="block text-green-600 text-sm mb-1">
//           Aporte mensual
//         </label>
//         <input
//           type="number"
//           placeholder="Mínimo $ 20.00"
//           className="w-full border rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400"
//         />
//       </div>

//       <div className="mt-4">
//         <label className="block text-green-600 text-sm mb-1">
//           Día en el que se realizarán los aportes
//         </label>
//         <select className="w-full border rounded-md px-4 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-400">
//           <option value="">Selecciona</option>
//           {[...Array(31)].map((_, i) => (
//             <option key={i + 1} value={i + 1}>
//               {i + 1}
//             </option>
//           ))}
//         </select>
//       </div>
//     </div>
//   );
// };

// export default formGoal;

// GoalModal.jsx
import React from "react";

const GoalModal = ({ goal, onClose }) => {
  if (!goal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ✕
        </button>
        <h3 className="text-xl font-bold mb-2">{goal.name}</h3>
        <p><strong>Ahorrado:</strong> ${goal.saved}</p>
        <p><strong>Meta Total:</strong> ${goal.total}</p>
        <p><strong>Progreso:</strong> {((goal.saved / goal.total) * 100).toFixed(1)}%</p>
        {/* Puedes agregar más info aquí */}
      </div>
    </div>
  );
};

export default GoalModal;
