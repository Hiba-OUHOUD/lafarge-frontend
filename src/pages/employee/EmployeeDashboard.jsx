import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axiosClient from '../../api/axiosClient';
import { SkeletonStatCard, SkeletonTrainingCard } from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';

const EmployeeDashboard = () => {
    const { user } = useAuth();
    const [recommended, setRecommended] = useState([]);
    const [others, setOthers] = useState([]);
    const [enrolledIds, setEnrolledIds] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const loadTrainings = async () => {
        try {
            const res = await axiosClient.get(`/employee/trainings/available?employeeId=${user.id}`);
            const { recommended, others } = res.data;  // ← Nouveau format

            const enrollRes = await axiosClient.get(`/employee/enrollments?employeeId=${user.id}`);
            const alreadyEnrolled = enrollRes.data.map(e => e.training.id);
            setEnrolledIds(alreadyEnrolled);

            setRecommended(recommended || []);
            setOthers(others || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) loadTrainings();
    }, [user]);

    const handleEnroll = async (trainingId) => {
        setMessage('');
        try {
            await axiosClient.post(`/employee/enroll/${trainingId}?employeeId=${user.id}`);
            setMessage('✅ Inscription réussie !');
            loadTrainings();
        } catch (err) {
            setMessage('❌ Erreur : ' + (err.response?.data?.error || 'Déjà inscrit'));
        }
    };
    const trackClick = async (training) => {
        try {
            await axiosClient.post('/employee/track-click', {
                userId: user.id,
                domain: training.domain
            });
        } catch (err) {
            console.error('Erreur tracking:', err);
        }
    };

    const TrainingCard = ({ training, recommended }) => (
        <div className={`bg-white p-5 rounded-lg shadow hover:shadow-lg transition border-t-4 ${
            recommended ? 'border-yellow-400' : 'border-blue-400'
        }`}>
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-bold text-blue-900 flex-1">{training.title}</h3>
                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold ml-2">
                    {training.domain || 'GENERAL'}
                </span>
            </div>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{training.description}</p>
            <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">
                    Par : {training.trainer ? `${training.trainer.firstName} ${training.trainer.lastName}` : 'Non assigné'}
                </span>
                <button
                    onClick={() => {
                        trackClick(training);
                        handleEnroll(training.id);
                    }}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium text-sm transition">
                    S'inscrire
                </button>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="p-8">
                <div className="h-24 bg-gray-200 rounded-lg animate-pulse mb-6"></div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                    <SkeletonStatCard />
                    <SkeletonStatCard />
                    <SkeletonStatCard />
                </div>
                <div className="h-6 w-64 bg-gray-200 rounded animate-pulse mb-4"></div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <SkeletonTrainingCard />
                    <SkeletonTrainingCard />
                    <SkeletonTrainingCard />
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            {/* En-tête de bienvenue */}
            <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-6 rounded-lg shadow mb-6">
                <h1 className="text-3xl font-bold mb-1">
                    Bonjour, {user?.firstName} {user?.lastName} 👋
                </h1>
                <p className="text-green-100">
                    Domaine : <span className="font-bold">{user?.domain || 'Non défini'}</span>
                    {user?.position && (
                        <>
                            {' • '}Poste : <span className="font-bold">{user.position}</span>
                        </>
                    )}
                </p>
            </div>

            {message && (
                <div className={`mb-6 p-3 rounded-lg text-center font-medium ${
                    message.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {message}
                </div>
            )}

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-400">
                    <p className="text-gray-500 text-sm">⭐ Recommandées</p>
                    <p className="text-3xl font-bold text-yellow-600">{recommended.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-400">
                    <p className="text-gray-500 text-sm">📚 Autres</p>
                    <p className="text-3xl font-bold text-blue-600">{others.length}</p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-400">
                    <p className="text-gray-500 text-sm">✅ Déjà inscrit</p>
                    <p className="text-3xl font-bold text-green-600">{enrolledIds.length}</p>
                </div>
            </div>

            {/* Section Recommandées */}
            <section className="mb-10">
                <div className="flex items-center mb-4">
                    <h2 className="text-2xl font-bold text-yellow-700">⭐ Recommandées pour vous</h2>
                    <span className="ml-3 bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-bold">
                        Domaine : {user?.domain}
                    </span>
                </div>
                {recommended.length === 0 ? (
                    <EmptyState
                        icon="⭐"
                        title="Aucune recommandation"
                        description="Aucune formation spécifique à votre domaine pour le moment. Explorez les autres formations ci-dessous !"
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recommended.map(t => (
                            <TrainingCard key={t.id} training={t} recommended={true} />
                        ))}
                    </div>
                )}
            </section>

            {/* Section Autres formations */}
            <section>
                <h2 className="text-2xl font-bold text-blue-700 mb-4">📚 Autres formations disponibles</h2>
                {others.length === 0 ? (
                    <EmptyState
                        icon="📚"
                        title="Aucune formation disponible"
                        description="Vous êtes inscrit à toutes les formations actuellement disponibles."
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {others.map(t => (
                            <TrainingCard key={t.id} training={t} recommended={false} />
                        ))}
                    </div>
                )}
            </section>
        </div>
    );
};

export default EmployeeDashboard;