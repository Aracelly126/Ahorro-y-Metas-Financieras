export const loginService = async (email, password) => {
    const apiUrl = import.meta.env.VITE_API_URL;

    const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
        const errorData = await response.json(); 
        console.error('Error de autenticación:', errorData);
        throw new Error('Error en la autenticación');
    }

    const data = await response.json();

    if (data.token) {
        localStorage.setItem('authToken', data.token);
    }

    return data;
};

