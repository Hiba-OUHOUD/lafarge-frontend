import React from 'react';
import { useNotifications } from '../context/NotificationContext';
import { useNavigate } from 'react-router-dom';

const ToastContainer = () => {
    const { toasts, markAsRead } = useNotifications();
    const navigate = useNavigate();

    if (toasts.length === 0) return null;

    const handleClick = async (toast) => {
        await markAsRead(toast.notification.id);
        navigate('/employee/notifications');
    };

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    onClick={() => handleClick(toast)}
                    className="bg-white border-l-4 border-blue-500 shadow-lg rounded-lg p-4 cursor-pointer hover:shadow-xl transition animate-slide-in"
                >
                    <div className="flex items-start gap-3">
                        <div className="text-2xl">🔔</div>
                        <div className="flex-1">
                            <p className="font-bold text-sm text-blue-900">
                                Nouvelle notification
                            </p>
                            <p className="text-sm text-gray-700 mt-1">
                                {toast.notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                                Cliquez pour voir →
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ToastContainer;