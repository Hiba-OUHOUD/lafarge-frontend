import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import axiosClient from '../api/axiosClient';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [toasts, setToasts] = useState([]);
    const [lastIds, setLastIds] = useState(new Set());

    // Charger les notifications
    const loadNotifications = useCallback(async (showToasts = false) => {
        if (!user || user.role !== 'EMPLOYEE') return;
        
        try {
            const res = await axiosClient.get(`/employee/notifications?employeeId=${user.id}`);
            const newNotifs = res.data;
            setNotifications(newNotifs);
            setUnreadCount(newNotifs.filter(n => !n.read).length);

            // Détecter les nouvelles notifications pour afficher un toast
            if (showToasts && lastIds.size > 0) {
                const nouvelles = newNotifs.filter(n => !lastIds.has(n.id) && !n.read);
                nouvelles.forEach(n => addToast(n));
            }

            // Mettre à jour la liste des IDs connus
            setLastIds(new Set(newNotifs.map(n => n.id)));
        } catch (err) {
            console.error('Erreur chargement notifications:', err);
        }
    }, [user, lastIds]);

    // Premier chargement + polling toutes les 30 secondes
    useEffect(() => {
        if (!user || user.role !== 'EMPLOYEE') return;

        loadNotifications(false);
        const interval = setInterval(() => {
            loadNotifications(true);
        }, 30000); // 30 secondes

        return () => clearInterval(interval);
    }, [user, loadNotifications]);

    // Ajouter un toast
    const addToast = (notification) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, notification }]);
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, 6000); // Disparaît après 6 secondes
    };

    // Marquer une notification comme lue
    const markAsRead = async (id) => {
        try {
            await axiosClient.put(`/employee/notifications/${id}/read`);
            setNotifications(prev => 
                prev.map(n => n.id === id ? { ...n, read: true } : n)
            );
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error(err);
        }
    };

    // Marquer toutes comme lues
    const markAllAsRead = async () => {
        const unread = notifications.filter(n => !n.read);
        
        // Appels API en parallèle
        try {
            await Promise.all(unread.map(n => 
                axiosClient.put(`/employee/notifications/${n.id}/read`)
            ));
            
            // Mise à jour locale en une seule fois
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error('Erreur markAllAsRead:', err);
        }
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            toasts,
            loadNotifications,
            markAsRead,
            markAllAsRead,
        }}>
            {children}
        </NotificationContext.Provider>
    );
};

export const useNotifications = () => useContext(NotificationContext);