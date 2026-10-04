import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import EmptyState from '../../components/EmptyState';
const Notifications = () => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);

    const load = async () => {
        const res = await axiosClient.get(`/employee/notifications?employeeId=${user.id}`);
        setNotifications(res.data);
    };

    useEffect(() => { load(); }, [user]);

    const markAsRead = async (id) => {
        await axiosClient.put(`/employee/notifications/${id}/read`);
        load();
    };

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold text-green-900 mb-8">Mes Notifications</h1>

            {notifications.length === 0 ? (
                <EmptyState
                    icon="🔔"
                    title="Aucune notification"
                    description="Vous n'avez pas encore reçu de notification."
                />
            ) : (
                <div className="space-y-3">
                    {notifications.map((n) => (
                        <div key={n.id} className={`p-4 rounded-lg shadow ${n.read ? 'bg-white' : 'bg-yellow-50 border-l-4 border-yellow-500'}`}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <span className={`text-xs font-bold ${
                                        n.type === 'CERTIFICATE_READY' ? 'text-green-700' : 'text-blue-700'
                                    }`}>{n.type}</span>
                                    <p className="mt-1">{n.message}</p>
                                    <p className="text-xs text-gray-500 mt-2">{new Date(n.createdAt).toLocaleString()}</p>
                                </div>
                                {!n.read && (
                                    <button
                                        onClick={() => markAsRead(n.id)}
                                        className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                                    >
                                        Marquer comme lu
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notifications;