import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const TrainerDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [trainings, setTrainings] = useState([]);
    const [selectedTraining, setSelectedTraining] = useState(null);
    const [learners, setLearners] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const statsRes = await axiosClient.get(`/trainer/${user.id}/stats`);
                setStats(statsRes.data);

                const trainRes = await axiosClient.get('/trainings');
                const myTrainings = trainRes.data.filter(t => t.trainer && t.trainer.id === user.id);
                setTrainings(myTrainings);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [user]);

    const openLearners = async (training) => {
        setSelectedTraining(training);
        try {
            const res = await axiosClient.get(`/trainer/training/${training.id}/learners`);
            setLearners(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return <div className="p-4 md:p-8 text-center">Chargement...</div>;

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-purple-900 mb-2">Tableau de bord Formateur</h1>
            <p className="text-gray-600 mb-8">Bonjour, <span className="font-bold">{user?.firstName} {user?.lastName}</span></p>

            {/* Statistiques */}
            {stats && (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white p-5 rounded-lg shadow border-l-4 border-purple-500">
                        <p className="text-gray-500 text-sm">Mes formations</p>
                        <p className="text-3xl font-bold text-purple-700">{stats.totalTrainings}</p>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow border-l-4 border-blue-500">
                        <p className="text-gray-500 text-sm">Apprenants uniques</p>
                        <p className="text-3xl font-bold text-blue-700">{stats.totalLearners}</p>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow border-l-4 border-green-500">
                        <p className="text-gray-500 text-sm">Progression moyenne</p>
                        <p className="text-3xl font-bold text-green-700">{stats.avgProgress}%</p>
                    </div>
                    <div className="bg-white p-5 rounded-lg shadow border-l-4 border-yellow-500">
                        <p className="text-gray-500 text-sm">Taux de réussite</p>
                        <p className="text-3xl font-bold text-yellow-700">{stats.successRate}%</p>
                        <p className="text-xs text-gray-400 mt-1">
                            {stats.totalQuizzesPassed} / {stats.totalQuizzesTaken} quiz réussis
                        </p>
                    </div>
                </div>
            )}

            {message && (
                <div className={`mb-4 p-3 rounded-lg text-center font-medium ${
                    message.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>{message}</div>
            )}

            {/* Liste des formations */}
            <h2 className="text-2xl font-bold text-purple-800 mb-4">📚 Mes formations assignées</h2>
            {trainings.length === 0 ? (
                <p className="text-gray-500 italic bg-white p-4 rounded-lg shadow-sm">
                    Aucune formation ne vous a été assignée.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {trainings.map((t) => (
                        <div key={t.id} className="bg-white p-6 rounded-lg shadow">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-lg font-bold text-purple-900 flex-1">{t.title}</h3>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                    t.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>{t.status}</span>
                            </div>
                            <p className="text-gray-600 text-sm mb-4">{t.description}</p>
                            <p className="text-xs text-gray-500 mb-4">
                                Domaine : <span className="font-medium">{t.domain || 'GENERAL'}</span>
                            </p>
                            <div className="flex gap-2 flex-wrap">
                                <button
                                    onClick={() => openLearners(t)}
                                    className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm font-medium"
                                >
                                    👥 Voir les apprenants
                                </button>
                                <button
                                    onClick={() => {
                                                console.log('🚀🚀🚀 Lien cliqué. t.id =', t.id);
                                                console.log('🚀🚀🚀 URL de navigation :', `/trainer/chapters/${t.id}`);
                                                navigate(`/trainer/chapters/${t.id}`);
                                            }}
                                    className="bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 text-sm font-medium"
                                >
                                    ✏️ Gérer les chapitres
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Modal Apprenants */}
            {selectedTraining && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-4 border-b sticky top-0 bg-white">
                            <h3 className="text-xl font-bold text-purple-900">
                                👥 Apprenants - {selectedTraining.title}
                            </h3>
                            <button onClick={() => setSelectedTraining(null)}
                                className="text-gray-500 hover:text-gray-800 text-2xl font-bold">
                                ×
                            </button>
                        </div>
                        <div className="p-4">
                            {learners.length === 0 ? (
                                <p className="text-gray-500 italic text-center py-8">
                                    Aucun apprenant n'est encore inscrit à cette formation.
                                </p>
                            ) : (
                                <table className="w-full text-sm">
                                    <thead className="bg-purple-900 text-white">
                                        <tr>
                                            <th className="p-3 text-left">Nom</th>
                                            <th className="p-3 text-left">Poste</th>
                                            <th className="p-3 text-center">Progression</th>
                                            <th className="p-3 text-center">Statut</th>
                                            <th className="p-3 text-center">Score Quiz</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {learners.map((l) => (
                                            <tr key={l.enrollmentId} className="border-b hover:bg-gray-50">
                                                <td className="p-3 font-medium">
                                                    {l.firstName} {l.lastName}
                                                    <div className="text-xs text-gray-500">{l.email}</div>
                                                </td>
                                                <td className="p-3 text-gray-600">{l.position || '-'}</td>
                                                <td className="p-3 text-center">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-20 bg-gray-200 rounded-full h-2">
                                                            <div className={`h-2 rounded-full ${
                                                                l.progress === 100 ? 'bg-green-600' : 'bg-blue-500'
                                                            }`} style={{ width: `${l.progress}%` }}></div>
                                                        </div>
                                                        <span className="text-xs font-medium">{l.progress}%</span>
                                                    </div>
                                                </td>
                                                <td className="p-3 text-center">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                        l.status === 'COMPLETED' 
                                                            ? 'bg-green-100 text-green-700' 
                                                            : 'bg-yellow-100 text-yellow-700'
                                                    }`}>{l.status}</span>
                                                </td>
                                                <td className="p-3 text-center">
                                                    {l.score !== null ? (
                                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                                            l.passed ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                        }`}>
                                                            {l.score}% {l.passed ? '✅' : '❌'}
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs text-gray-400">Non passé</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrainerDashboard;