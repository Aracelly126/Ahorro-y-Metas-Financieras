import React, { useState } from "react";

const goals = [
  {
    id: 1,
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
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Mis Metas de Ahorro</h2>
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
  );
};


export default ListGoals;
