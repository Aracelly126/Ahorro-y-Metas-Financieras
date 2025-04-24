
export const loginService = async (correo, contraseña) => {
    const apiUrl = process.env.REACT_API_URL;

    const response = await fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({correo,contraseña}),

    });

    if (!response.ok) {
        throw new Error('Error en la autenticación');
    }

    const data = await response.json();

    return data;
};