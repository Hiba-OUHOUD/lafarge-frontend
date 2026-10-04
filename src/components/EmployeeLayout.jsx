import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import NotificationBell from './NotificationBell';

// Composant sorti du parent pour éviter le re-mount à chaque re-render
const SidebarContent = ({ user, unreadCount, onLogout, onLinkClick }) => {
    const menuItems = [
        { path: '/employee', label: '🏠 Tableau de bord' },
        { path: '/employee/my-learnings', label: '📚 Mes formations' },
        { path: '/employee/notifications', label: '🔔 Notifications', badge: unreadCount },
    ];

    return (
        <>
            <h1 className="text-2xl font-bold mb-8 text-center">Lafarge</h1>
            <nav className="flex-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end
                        onClick={onLinkClick}
                        className={({ isActive }) =>
                            `flex items-center justify-between py-3 px-4 rounded-lg mb-2 transition ${
                                isActive ? 'bg-green-600 font-bold' : 'hover:bg-green-800'
                            }`
                        }
                    >
                        <span>{item.label}</span>
                        {item.badge > 0 && (
                            <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2 py-0.5">
                                {item.badge > 9 ? '9+' : item.badge}
                            </span>
                        )}
                    </NavLink>
                ))}
            </nav>
            <div className="border-t border-green-700 pt-4">
                <p className="text-sm text-green-200 mb-2">
                    Connecté : <span className="font-bold">{user?.firstName}</span>
                </p>
                <button
                    type="button"
                    onClick={onLogout}
                    className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg font-medium cursor-pointer"
                >
                    Déconnexion
                </button>
            </div>
        </>
    );
};

const EmployeeLayout = () => {
    const { user, logout } = useAuth();
    const { unreadCount } = useNotifications();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const closeSidebar = () => setSidebarOpen(false);

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar Desktop */}
            <aside className="hidden md:flex flex-col w-64 bg-green-900 text-white p-4 min-h-screen shrink-0">
                <SidebarContent
                    user={user}
                    unreadCount={unreadCount}
                    onLogout={handleLogout}
                    onLinkClick={closeSidebar}
                />
            </aside>

            {/* Sidebar Mobile */}
            {sidebarOpen && (
                <div className="md:hidden fixed inset-0 z-50 flex">
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50"
                        onClick={closeSidebar}
                    ></div>
                    <aside className="relative flex flex-col w-64 bg-green-900 text-white p-4 h-full z-50 overflow-y-auto">
                        <button
                            type="button"
                            onClick={closeSidebar}
                            className="absolute top-3 right-3 text-white text-2xl font-bold"
                        >
                            ×
                        </button>
                        <SidebarContent
                            user={user}
                            unreadCount={unreadCount}
                            onLogout={handleLogout}
                            onLinkClick={closeSidebar}
                        />
                    </aside>
                </div>
            )}

            {/* Contenu principal */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Header avec cloche (mobile ET desktop) */}
                <header className="bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-30">
                    <button
                        type="button"
                        onClick={() => setSidebarOpen(true)}
                        className="md:hidden text-2xl text-gray-700"
                    >
                        ☰
                    </button>
                    <div className="hidden md:block text-blue-900 font-semibold">
                        Espace Employé
                    </div>
                    <NotificationBell />
                </header>

                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default EmployeeLayout;