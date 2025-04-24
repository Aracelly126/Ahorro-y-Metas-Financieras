export const registerService = async (formData) => {
    try {
        const apiUrl = import.meta.env.VITE_API_URL;

        const response = await fetch(`${apiUrl}/auth/register`, {
            method: 'POST',
            body: formData,
            headers: {
                // Forzamos a que el servidor sepa que esperamos JSON
                'Accept': 'application/json',
            },
            credentials: 'include', // Importante si Laravel usa cookies/sanctum
        });

        const contentType = response.headers.get("content-type");

        if (contentType && contentType.includes("application/json")) {
            return await response.json();
        } else {
            return { error: "Respuesta no válida del servidor" };
        }

    } catch (error) {
        console.error('Error en el registro:', error);
        return { error: 'Error de red' };
    }
};
