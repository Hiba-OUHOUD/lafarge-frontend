import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
import EmptyState from '../../components/EmptyState';

const MyLearnings = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [enrollments, setEnrollments] = useState([]);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const loadEnrollments = async () => {
        try {
            const res = await axiosClient.get(`/employee/enrollments?employeeId=${user.id}`);
            setEnrollments(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadEnrollments(); }, [user]);

    const downloadCertificate = async (enrollmentId) => {
        setMessage('');
        try {
            const res = await axiosClient.get(
                `/employee/certificate/${enrollmentId}/download`,
                { responseType: 'blob' }
            );

            // Créer un lien de téléchargement
            const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `certificat_${enrollmentId}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            setMessage('✅ Certificat téléchargé avec succès !');
        } catch (err) {
            console.error(err);
            setMessage('❌ Erreur : impossible de télécharger le certificat.');
        }
    };

    if (loading) return (
        <div className="p-8">
            <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-8"></div>
            <div className="space-y-4">
                {[1, 2, 3].map(i => (
                    <div key={i} className="bg-white p-6 rounded-lg shadow">
                        <div className="h-6 w-1/2 bg-gray-200 rounded animate-pulse mb-4"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4 mb-4"></div>
                        <div className="h-2 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold text-green-900 mb-8">Mes Formations</h1>

            {message && (
                <div className={`mb-4 p-3 rounded-lg text-center font-medium ${
                    message.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                    {message}
                </div>
            )}

            {enrollments.length === 0 ? (
                <EmptyState
                    icon="📖"
                    title="Aucune formation en cours"
                    description="Rendez-vous sur le tableau de bord pour découvrir et vous inscrire à des formations."
                />
            ) : (
                <div className="space-y-4">
                    {enrollments.map((e) => (
                        <div key={e.id} className="bg-white p-6 rounded-lg shadow">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-blue-900">{e.training.title}</h3>
                                    <span className="text-xs text-gray-500">
                                        Domaine : {e.training.domain || 'GENERAL'}
                                    </span>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-bold ${
                                    e.status === 'COMPLETED' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {e.status === 'COMPLETED' ? '✅ TERMINÉ' : '📖 EN COURS'}
                                </span>
                            </div>

                            <p className="text-gray-600 text-sm mb-4">{e.training.description}</p>

                            {/* Barre de progression */}
                            <div className="mb-2 flex justify-between text-sm text-gray-600">
                                <span>Progression</span>
                                <span className="font-bold">{e.progress}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
                                <div
                                    className={`h-3 rounded-full transition-all ${
                                        e.progress === 100 ? 'bg-green-600' : 'bg-blue-500'
                                    }`}
                                    style={{ width: `${e.progress}%` }}
                                ></div>
                            </div>

                            {/* Boutons d'action */}
                            <div className="flex gap-2 flex-wrap">
                                {e.status !== 'COMPLETED' && (
                                    <button
                                        onClick={() => navigate(`/employee/learning/${e.id}`)}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
                                    >
                                        ▶️ Continuer
                                    </button>
                                )}

                                {e.progress === 100 && e.status !== 'COMPLETED' && (
                                    <button
                                        onClick={() => navigate(`/employee/quiz/${e.id}`)}
                                        className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium"
                                    >
                                        🎓 Passer le Quiz
                                    </button>
                                )}

                                {e.status === 'COMPLETED' && (
                                    <button
                                        onClick={() => downloadCertificate(e.id)}
                                        className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-medium flex items-center gap-2"
                                    >
                                        📜 Télécharger mon certificat
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyLearnings;