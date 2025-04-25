import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import { getNotifications } from "./notificationService";

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getNotifications();
                setNotifications(data);
            } catch (err) {
                console.error("Error cargando notificaciones:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const unreadNotifications = notifications.filter(n => !n.read).length;

    return (
        <div className="relative">
            <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 relative"
            >
                <FaBell className="text-xl" />
                {unreadNotifications > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadNotifications}
                    </span>
                )}
            </button>

            {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 max-h-[400px] overflow-y-auto rounded-md shadow-lg z-50 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-2 border-b dark:border-gray-600">
                        <p className="font-medium">Notificaciones</p>
                    </div>
                    {loading ? (
                        <div className="p-4 text-gray-500 text-sm">Cargando...</div>
                    ) : notifications.length > 0 ? (
                        notifications.map(notification => (
                            <div 
                                key={notification.id} 
                                className={`px-4 py-3 border-b dark:border-gray-600 ${!notification.read ? "bg-blue-50 dark:bg-blue-900" : ""}`}
                            >
                                <p className="font-semibold">{notification.title}</p>
                                <p className="text-sm">{notification.message}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-3 text-center text-gray-500">
                            No hay notificaciones
                        </div>
                    )}
                    <div className="px-4 py-2 text-center border-t dark:border-gray-600">
                        <button className="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                            Ver todas
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;
