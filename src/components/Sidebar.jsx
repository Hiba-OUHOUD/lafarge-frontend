import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const menuItems = [
    { path: '/admin', label: '🏠 Tableau de bord' },
    { path: '/admin/users', label: '👥 Utilisateurs' },
    { path: '/admin/trainings', label: '📚 Formations' },
    { path: '/admin/stats', label: '📊 Statistiques' },  // ← NOUVEAU
];

    return (
        <div className="w-64 bg-blue-900 text-white min-h-screen p-4 flex flex-col">
            <h1 className="text-2xl font-bold mb-8 text-center">Lafarge</h1>
            
            <nav className="flex-1">
                {menuItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        end
                        className={({ isActive }) =>
                            `block py-3 px-4 rounded-lg mb-2 transition ${
                                isActive ? 'bg-blue-600 font-bold' : 'hover:bg-blue-800'
                            }`
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            <div className="border-t border-blue-700 pt-4">
                <p className="text-sm text-blue-200 mb-2">
                    Connecté : <span className="font-bold">{user?.firstName}</span>
                </p>
                <button
                    onClick={handleLogout}
                    className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg"
                >
                    Déconnexion
                </button>
            </div>
        </div>
    );
};

export default Sidebar;