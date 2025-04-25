export const getNotifications = async () => {
    const apiUrl = import.meta.env.VITE_API_URL;
    const token = localStorage.getItem("authToken");

    const response = await fetch(`${apiUrl}/alerts`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json",
        }
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Error al obtener notificaciones:', errorData);
        throw new Error('No se pudieron cargar las notificaciones');
    }

    const data = await response.json();

    // Mapeo para ajustar al formato del componente si es necesario
    return data.map(alert => ({
        id: alert.id,
        title: alert.alert_name,
        message: alert.alert_message,
        time: new Date(alert.alert_date).toLocaleString(),
        read: false, // Si tu tabla no tiene campo "read", puedes manejarlo en frontend
    }));
};
