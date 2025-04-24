
export const registerService = async (formData) => {
    try {
        const apiUrl = process.env.REACT_API_URL;

    const response = await fetch(`${apiUrl}/register`, {
        method: 'POST',
        body: formData,
    });
    return await response.json();
    } catch (error) {
        console.error('Error en el registro:', error);
        return {error: 'Error de red' };
    }
    

};