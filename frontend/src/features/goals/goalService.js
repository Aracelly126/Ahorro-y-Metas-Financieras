const apiUrl = import.meta.env.VITE_API_URL;
const getAuthToken = () => localStorage.getItem('authToken');

export const getGoals = async () => {
    const response = await fetch(`${apiUrl}/goals`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al obtener metas:', errorData);
        throw new Error('No se pudieron obtener las metas');
    }

    return await response.json();
};

export const createGoal = async (goalData) => {
    const response = await fetch(`${apiUrl}/goals`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(goalData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al crear meta:', errorData);
        throw new Error('No se pudo crear la meta');
    }

    return await response.json();
};

export const getGoal = async (id) => {
    const response = await fetch(`${apiUrl}/goals/${id}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al obtener meta:', errorData);
        throw new Error('No se pudo obtener la meta');
    }

    return await response.json();
};

export const updateGoal = async (id, goalData) => {
    const response = await fetch(`${apiUrl}/goals/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${getAuthToken()}`
        },
        body: JSON.stringify(goalData)
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al actualizar meta:', errorData);
        throw new Error('No se pudo actualizar la meta');
    }

    return await response.json();
};

export const deleteGoal = async (id) => {
    const response = await fetch(`${apiUrl}/goals/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getAuthToken()}`
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al eliminar meta:', errorData);
        throw new Error('No se pudo eliminar la meta');
    }

    return await response.json();
};