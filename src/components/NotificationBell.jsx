import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../context/NotificationContext';

const NotificationBell = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    const navigate = useNavigate();

    // Fermer le dropdown en cliquant ailleurs
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNotifClick = async (notif) => {
        if (!notif.read) {
            await markAsRead(notif.id);
        }
        setIsOpen(false);
        navigate('/employee/notifications');
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-gray-100 transition"
                title="Notifications"
            >
                <span className="text-2xl">🔔</span>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border z-50">
                    <div className="p-3 border-b flex justify-between items-center">
                        <h3 className="font-bold text-blue-900">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="text-xs text-blue-600 hover:underline"
                            >
                                Tout marquer comme lu
                            </button>
                        )}
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <p className="p-4 text-center text-gray-500 text-sm italic">
                                Aucune notification
                            </p>
                        ) : (
                            notifications.slice(0, 5).map(n => (
                                <div
                                    key={n.id}
                                    onClick={() => handleNotifClick(n)}
                                    className={`p-3 border-b cursor-pointer hover:bg-gray-50 transition ${
                                        !n.read ? 'bg-blue-50' : ''
                                    }`}
                                >
                                    <div className="flex items-start gap-2">
                                        <span className="text-lg">
                                            {n.type === 'CERTIFICATE_READY' ? '🎓' : '📢'}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className={`text-sm ${!n.read ? 'font-bold' : ''} text-gray-800`}>
                                                {n.message}
                                            </p>
                                            <p className="text-xs text-gray-400 mt-1">
                                                {new Date(n.createdAt).toLocaleDateString('fr-FR', {
                                                    day: '2-digit',
                                                    month: 'short',
                                                    hour: '2-digit',
                                                    minute: '2-digit'
                                                })}
                                            </p>
                                        </div>
                                        {!n.read && (
                                            <span className="w-2 h-2 bg-blue-500 rounded-full mt-1"></span>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {notifications.length > 5 && (
                        <button
                            onClick={() => { setIsOpen(false); navigate('/employee/notifications'); }}
                            className="w-full p-3 text-center text-sm text-blue-600 hover:bg-gray-50 border-t font-medium"
                        >
                            Voir toutes les notifications →
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default NotificationBell;