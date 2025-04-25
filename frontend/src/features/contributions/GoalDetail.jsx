import React, { useState, useEffect } from "react";
import {
  getContributions,
  createContribution,
  updateContribution,
  deleteContribution,
  calculateRemainingAmount,
} from "../../features/contributions/contributionService";
import ContributionForm from "../contributions/contributionForm";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaPiggyBank,
  FaChartLine,
  FaMoneyBillWave,
  FaTimes,
} from "react-icons/fa";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const ContributionsManager = ({ goal }) => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentContribution, setCurrentContribution] = useState(null);
  const [remainingAmount, setRemainingAmount] = useState(goal.target_amount);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getContributions(goal.goal_id);
        setContributions(data);
        setRemainingAmount(calculateRemainingAmount(goal, data));
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [goal]);

  const handleSaveContribution = async (formData) => {
    try {
      setLoading(true); // Activar carga mientras se procesa

      const contributionData = {
        amount: formData.amount,
        contribution_date: formData.date,
        remaining_amount: remainingAmount - Number(formData.amount),
      };

      if (currentContribution) {
        // Actualizar contribución existente
        const updated = await updateContribution(
          goal.goal_id,
          currentContribution.contribution_id,
          contributionData
        );
        setContributions(
          contributions.map((c) =>
            c.contribution_id === currentContribution.contribution_id
              ? updated
              : c
          )
        );
      } else {
        // Crear nueva contribución
        const newContribution = await createContribution(
          goal.goal_id,
          contributionData
        );
        setContributions([...contributions, newContribution]);
      }

      // Recargar datos desde el servidor para asegurar consistencia
      const updatedData = await getContributions(goal.goal_id);
      setContributions(updatedData);
      setRemainingAmount(calculateRemainingAmount(goal, updatedData));

      setShowModal(false);
      setCurrentContribution(null);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (contributionId) => {
    if (!window.confirm("¿Estás seguro de eliminar esta contribución?")) return;

    try {
      await deleteContribution(goal.goal_id, contributionId);
      const updatedContributions = contributions.filter(
        (c) => c.contribution_id !== contributionId
      );
      setContributions(updatedContributions);
      setRemainingAmount(calculateRemainingAmount(goal, updatedContributions));
    } catch (err) {
      setError(err.message);
    }
  };

  const totalContributed = contributions.reduce(
    (sum, c) => sum + Number(c.amount),
    0
  );
  const progressPercentage = (totalContributed / goal.target_amount) * 100;

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      {/* Encabezado con información de la meta */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{goal.goal_name}</h2>
            <p className="text-blue-100">
              Fecha límite:{" "}
              {format(new Date(goal.deadline_date), "PPP", { locale: es })}
            </p>
          </div>
          <div className="bg-white/20 p-3 rounded-full">
            <FaPiggyBank className="text-2xl" />
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="mt-6">
          <div className="flex justify-between text-sm mb-1">
            <span>Progreso: {progressPercentage.toFixed(1)}%</span>
            <span>
              ${totalContributed.toLocaleString()} / $
              {goal.target_amount.toLocaleString()}
            </span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-2.5">
            <div
              className="bg-white h-2.5 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Resumen financiero */}
        <div className="grid grid-cols-3 gap-4 mt-6 text-center">
          <div className="bg-white/10 p-3 rounded-lg">
            <p className="text-sm text-blue-100">Monto Total</p>
            <p className="font-bold text-lg">
              ${goal.target_amount.toLocaleString()}
            </p>
          </div>
          <div className="bg-white/10 p-3 rounded-lg">
            <p className="text-sm text-blue-100">Aportado</p>
            <p className="font-bold text-lg">
              ${totalContributed.toLocaleString()}
            </p>
          </div>
          <div className="bg-white/10 p-3 rounded-lg">
            <p className="text-sm text-blue-100">Restante</p>
            <p className="font-bold text-lg">
              ${remainingAmount.toLocaleString()}
            </p>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="p-6">
        {/* Controles */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h3 className="text-xl font-semibold text-gray-800">
              Registro de Aportes
            </h3>
            <p className="text-gray-500 text-sm">
              Historial de contribuciones a esta meta
            </p>
          </div>
          <button
            onClick={() => {
              setCurrentContribution(null);
              setShowModal(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            disabled={remainingAmount <= 0}
          >
            <FaPlus /> Nuevo Aporte
          </button>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Contenido */}
        {loading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : contributions.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <FaMoneyBillWave className="mx-auto text-4xl text-gray-400 mb-4" />
            <h4 className="text-lg font-medium text-gray-700">
              No hay aportes registrados
            </h4>
            <p className="text-gray-500 mt-1">
              Comienza agregando tu primer aporte
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {contributions.map((contribution) => (
                  <tr
                    key={contribution.contribution_id}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium text-green-600">
                        ${Number(contribution.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {contribution.contribution_date
                        ? format(
                            new Date(contribution.contribution_date),
                            "PPP",
                            { locale: es }
                          )
                        : "--"}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => {
                          setCurrentContribution(contribution);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() =>
                          handleDelete(contribution.contribution_id)
                        }
                        className="text-red-600 hover:text-red-900"
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-4 text-white">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                  {currentContribution ? "Editar" : "Nuevo"} Aporte
                </h3>
                <button
                  onClick={() => {
                    setCurrentContribution(null);
                    setShowModal(false);
                  }}
                  className="text-white/80 hover:text-white"
                >
                  <FaTimes className="text-xl" />
                </button>
              </div>
            </div>
            <div className="p-6">
              <ContributionForm
                goal={goal}
                onSave={handleSaveContribution}
                onCancel={() => {
                  setCurrentContribution(null);
                  setShowModal(false);
                }}
                initialData={currentContribution}
                remainingAmount={remainingAmount}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContributionsManager;
