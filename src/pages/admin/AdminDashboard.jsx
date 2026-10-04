import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const AdminDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [recentUsers, setRecentUsers] = useState([]);
    const [recentTrainings, setRecentTrainings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const usersRes = await axiosClient.get('/admin/users');
                // Les 5 derniers utilisateurs (triés par createdAt desc)
                const sortedUsers = usersRes.data
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5);
                setRecentUsers(sortedUsers);

                const trainRes = await axiosClient.get('/trainings');
                const sortedTrainings = trainRes.data
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                    .slice(0, 5);
                setRecentTrainings(sortedTrainings);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    if (loading) return <div className="p-8 text-center">Chargement...</div>;

    return (
        <div className="p-8">
            {/* Bannière de bienvenue */}
            <div className="bg-gradient-to-r from-blue-700 to-blue-900 text-white p-4 md:p-8 rounded-lg shadow mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    Bonjour, {user?.firstName} 👋
                </h1>
                <p className="text-blue-100">
                    Bienvenue sur le panneau d'administration de la plateforme Lafarge E-Learning.
                </p>
            </div>

            {/* Raccourcis rapides */}
            <h2 className="text-2xl font-bold text-blue-900 mb-4">⚡ Actions rapides</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
                <button
                    onClick={() => navigate('/admin/users')}
                    className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-left border-l-4 border-blue-500 group"
                >
                    <div className="text-3xl mb-2">👥</div>
                    <h3 className="font-bold text-lg text-blue-900 group-hover:text-blue-700">
                        Gérer les utilisateurs
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Ajouter des employés ou formateurs
                    </p>
                </button>

                <button
                    onClick={() => navigate('/admin/trainings')}
                    className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-left border-l-4 border-green-500 group"
                >
                    <div className="text-3xl mb-2">📚</div>
                    <h3 className="font-bold text-lg text-blue-900 group-hover:text-green-700">
                        Gérer les formations
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Créer, publier, assigner un formateur
                    </p>
                </button>

                <button
                    onClick={() => navigate('/admin/stats')}
                    className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition text-left border-l-4 border-purple-500 group"
                >
                    <div className="text-3xl mb-2">📊</div>
                    <h3 className="font-bold text-lg text-blue-900 group-hover:text-purple-700">
                        Voir les statistiques
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Graphiques et analyses détaillées
                    </p>
                </button>
            </div>

            {/* Activité récente */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Derniers utilisateurs */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-blue-900">👤 Derniers utilisateurs</h2>
                        <button
                            onClick={() => navigate('/admin/users')}
                            className="text-blue-600 text-sm hover:underline"
                        >
                            Voir tout →
                        </button>
                    </div>
                    {recentUsers.length === 0 ? (
                        <p className="text-gray-500 italic text-sm">Aucun utilisateur.</p>
                    ) : (
                        <ul className="space-y-3">
                            {recentUsers.map((u) => (
                                <li key={u.id} className="flex items-center gap-3 pb-3 border-b last:border-0">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                                        u.role === 'ADMIN' ? 'bg-red-500' :
                                        u.role === 'TRAINER' ? 'bg-purple-500' :
                                        'bg-green-500'
                                    }`}>
                                        {u.firstName?.charAt(0)}{u.lastName?.charAt(0)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium text-sm truncate">
                                            {u.firstName} {u.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500 truncate">{u.email}</p>
                                    </div>
                                    <span className={`text-xs font-bold px-2 py-1 rounded ${
                                        u.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                                        u.role === 'TRAINER' ? 'bg-purple-100 text-purple-700' :
                                        'bg-green-100 text-green-700'
                                    }`}>{u.role}</span>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* Dernières formations */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-lg font-bold text-blue-900">📖 Dernières formations</h2>
                        <button
                            onClick={() => navigate('/admin/trainings')}
                            className="text-blue-600 text-sm hover:underline"
                        >
                            Voir tout →
                        </button>
                    </div>
                    {recentTrainings.length === 0 ? (
                        <p className="text-gray-500 italic text-sm">Aucune formation.</p>
                    ) : (
                        <ul className="space-y-3">
                            {recentTrainings.map((t) => (
                                <li key={t.id} className="pb-3 border-b last:border-0">
                                    <div className="flex justify-between items-start gap-2">
                                        <p className="font-medium text-sm flex-1 truncate">
                                            {t.title}
                                        </p>
                                        <span className={`text-xs font-bold px-2 py-1 rounded whitespace-nowrap ${
                                            t.status === 'PUBLISHED'
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-yellow-100 text-yellow-700'
                                        }`}>{t.status}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {t.domain || 'GENERAL'} • Formateur : {t.trainer ? `${t.trainer.firstName} ${t.trainer.lastName}` : 'Non assigné'}
                                    </p>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;