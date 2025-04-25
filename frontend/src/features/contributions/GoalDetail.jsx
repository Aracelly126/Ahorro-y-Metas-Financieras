import React, { useState, useEffect } from 'react';
import { 
    getContributions, 
    createContribution,
    updateContribution,
    deleteContribution,
    calculateRemainingAmount
} from '../../features/contributions/contributionService';
import ContributionForm from '../contributions/contributionForm';

const ContributionsManager = ({ goal }) => {
    const [contributions, setContributions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [currentContribution, setCurrentContribution] = useState(null);
    const [remainingAmount, setRemainingAmount] = useState(goal.target_amount);

    // Cargar contribuciones y calcular remaining_amount
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

    // Manejar creación/actualización de contribuciones
    const handleSaveContribution = async (formData) => {
        try {
            const contributionData = {
                amount: formData.amount,
                contribution_date: formData.date,
                remaining_amount: remainingAmount - Number(formData.amount)
            };

            let updatedContributions;
            if (currentContribution) {
                // Actualizar contribución existente
                const updated = await updateContribution(
                    goal.goal_id, 
                    currentContribution.contribution_id, 
                    contributionData
                );
                updatedContributions = contributions.map(c => 
                    c.contribution_id === currentContribution.contribution_id ? updated : c
                );
            } else {
                // Crear nueva contribución
                const newContribution = await createContribution(goal.goal_id, contributionData);
                updatedContributions = [...contributions, newContribution];
            }

            setContributions(updatedContributions);
            setRemainingAmount(calculateRemainingAmount(goal, updatedContributions));
            setShowModal(false);
        } catch (err) {
            setError(err.message);
        }
    };

    // Manejar eliminación de contribución
    const handleDelete = async (contributionId) => {
        try {
            await deleteContribution(goal.goal_id, contributionId);
            const updatedContributions = contributions.filter(c => c.contribution_id !== contributionId);
            setContributions(updatedContributions);
            setRemainingAmount(calculateRemainingAmount(goal, updatedContributions));
        } catch (err) {
            setError(err.message);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md">
            {/* Header con información de la meta */}
            <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                <h2 className="text-xl font-semibold text-gray-800">{goal.goal_name}</h2>
                <div className="mt-2 grid grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm text-gray-500">Monto Total</p>
                        <p className="font-medium">${goal.target_amount}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Aportado</p>
                        <p className="font-medium">
                            ${contributions.reduce((sum, c) => sum + Number(c.amount), 0)}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500">Restante</p>
                        <p className="font-medium">${remainingAmount}</p>
                    </div>
                </div>
            </div>

            {/* Controles y tabla de contribuciones */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Contribuciones</h3>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    disabled={remainingAmount <= 0}
                >
                    + Nueva Contribución
                </button>
            </div>

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

            {loading ? (
                <p>Cargando contribuciones...</p>
            ) : contributions.length === 0 ? (
                <p className="text-gray-500">No hay contribuciones registradas</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        {/* Encabezados de tabla */}
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fecha</th>
                            </tr>
                        </thead>
                        {/* Cuerpo de tabla */}
                        <tbody className="bg-white divide-y divide-gray-200">
                            {contributions.map(contribution => (
                                <tr key={contribution.contribution_id}>
                                    <td className="px-6 py-4">${contribution.amount}</td>
                                    <td className="px-6 py-4">
                                        {new Date(contribution.contribution_date).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Modal para el formulario */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                        <div className="p-4 border-b">
                            <h3 className="text-lg font-semibold">
                                {currentContribution ? 'Editar' : 'Nueva'} Contribución
                            </h3>
                        </div>
                        <div className="p-4">
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
