import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const TrainerLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const SidebarContent = () => (
        <>
            <h1 className="text-2xl font-bold mb-8 text-center">Lafarge</h1>
            <nav className="flex-1">
                <NavLink
                    to="/trainer"
                    end
                    onClick={() => setSidebarOpen(false)}
                    className={({ isActive }) =>
                        `block py-3 px-4 rounded-lg mb-2 transition ${
                            isActive ? 'bg-purple-600 font-bold' : 'hover:bg-purple-800'
                        }`
                    }
                >
                    🏠 Mes formations
                </NavLink>
            </nav>
            <div className="border-t border-purple-700 pt-4">
                <p className="text-sm text-purple-200 mb-2">
                    Connecté : <span className="font-bold">{user?.firstName}</span>
                </p>
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg"
                >
                    Déconnexion
                </button>
            </div>
        </>
    );

    return (
        <div className="flex min-h-screen">
            {/* Sidebar Desktop */}
            <div className="hidden md:flex w-64 bg-purple-900 text-white p-4 flex-col">
                <SidebarContent />
            </div>

            {/* Sidebar Mobile */}
            {sidebarOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    ></div>
                    <div className="fixed top-0 left-0 w-64 h-full bg-purple-900 text-white p-4 z-50 flex flex-col md:hidden">
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="absolute top-4 right-4 text-white text-2xl"
                        >
                            ×
                        </button>
                        <SidebarContent />
                    </div>
                </>
            )}

            {/* Contenu principal */}
            <div className="flex-1 bg-gray-100 min-h-screen">
                {/* Header Mobile */}
                <div className="md:hidden bg-white shadow-sm p-4 flex items-center justify-between sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-2xl text-gray-700"
                    >
                        ☰
                    </button>
                    <h1 className="font-bold text-purple-900">Lafarge Formateur</h1>
                    <div className="w-8"></div>
                </div>

                <Outlet />
            </div>
        </div>
    );
};

export default TrainerLayout;