import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EmployeeDashboard = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-lg shadow">
                <h1 className="text-3xl font-bold text-green-700">Dashboard Employé</h1>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600">
                    Déconnexion
                </button>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
                <p className="text-lg">Bienvenue, <span className="font-bold">{user?.firstName} {user?.lastName}</span> !</p>
                <p className="text-gray-500 mt-2">Rôle : {user?.role}</p>
            </div>
        </div>
    );
};

export default EmployeeDashboard;