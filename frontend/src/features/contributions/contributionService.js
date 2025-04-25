const API_URL = import.meta.env.VITE_API_URL;

export const getContributions = async (goalId) => {
    const response = await fetch(`${API_URL}/goals/${goalId}/contributions`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        }
    });
    if (!response.ok) throw new Error('Error al obtener contribuciones');
    return await response.json();
};

export const createContribution = async (goalId, contributionData) => {
    const response = await fetch(`${API_URL}/goals/${goalId}/contributions`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(contributionData),
    });
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors || 'Error al crear contribución');
    }
    return await response.json();
};

// Función para calcular el remaining_amount
export const calculateRemainingAmount = (goal, contributions) => {
    const totalContributions = contributions.reduce((sum, c) => sum + Number(c.amount), 0);
    return Number(goal.target_amount) - totalContributions;
};

// Obtener una contribución específica
export const getContribution = async (goalId, contributionId) => {
    try {
        const response = await fetch(`${API_URL}/goals/${goalId}/contributions/${contributionId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });
        if (!response.ok) {
            throw new Error('Error al obtener la contribución');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

// Actualizar una contribución
export const updateContribution = async (goalId, contributionId, updatedData) => {
    try {
        const response = await fetch(`${API_URL}/goals/${goalId}/contributions/${contributionId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify(updatedData),
        });
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.errors || 'Error al actualizar la contribución');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};

// Eliminar una contribución
export const deleteContribution = async (goalId, contributionId) => {
    try {
        const response = await fetch(`${API_URL}/goals/${goalId}/contributions/${contributionId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });
        if (!response.ok) {
            throw new Error('Error al eliminar la contribución');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error);
        throw error;
    }
};
