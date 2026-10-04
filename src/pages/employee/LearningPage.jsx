import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const LearningPage = () => {
    const { enrollmentId } = useParams();
    const navigate = useNavigate();
    const [enrollment, setEnrollment] = useState(null);
    const [chapters, setChapters] = useState([]);
    const [completedIds, setCompletedIds] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    const loadData = async () => {
        try {
            const enrRes = await axiosClient.get(`/employee/enrollment/${enrollmentId}`);
            setEnrollment(enrRes.data);

            const chapRes = await axiosClient.get(`/employee/training/${enrRes.data.training.id}/chapters`);
            setChapters(chapRes.data);

            const compRes = await axiosClient.get(`/employee/enrollment/${enrollmentId}/chapters-completed`);
            setCompletedIds(compRes.data);

            // Se positionner sur le premier chapitre non terminé
            const firstNotCompleted = chapRes.data.findIndex(c => !compRes.data.includes(c.id));
            if (firstNotCompleted >= 0) {
                setCurrentIndex(firstNotCompleted);
            } else if (chapRes.data.length > 0) {
                setCurrentIndex(chapRes.data.length - 1);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadData(); }, [enrollmentId]);

    const markChapterComplete = async () => {
        const currentChapter = chapters[currentIndex];
        if (!currentChapter) return;

        try {
            const res = await axiosClient.post(
                `/employee/enrollment/${enrollmentId}/chapter/${currentChapter.id}/complete`
            );
            setMessage(`✅ Chapitre terminé ! Progression : ${res.data.progress}%`);
            
            // Recharger
            await loadData();
            
            // Passer au chapitre suivant si disponible
            if (currentIndex < chapters.length - 1) {
                setTimeout(() => setCurrentIndex(currentIndex + 1), 800);
            }
        } catch (err) {
            setMessage('❌ Erreur');
        }
    };

    if (loading) return <div className="p-4 md:p-8 text-center">Chargement...</div>;
    if (!enrollment || chapters.length === 0) {
        return (
            <div className="p-8 text-center text-gray-500">
                Aucun chapitre disponible pour cette formation.
                <br />
                <button onClick={() => navigate('/employee/my-learnings')} 
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg">
                    ← Retour
                </button>
            </div>
        );
    }

    const currentChapter = chapters[currentIndex];
    const isCurrentCompleted = completedIds.includes(currentChapter.id);
    const totalChapters = chapters.length;
    const completedCount = completedIds.length;
    const progressPercent = Math.round((completedCount / totalChapters) * 100);

    return (
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
            <button
                onClick={() => navigate('/employee/my-learnings')}
                className="text-blue-600 mb-4 hover:underline"
            >
                ← Retour à mes formations
            </button>

            <h1 className="text-3xl font-bold text-blue-900 mb-2">{enrollment.training.title}</h1>
            <p className="text-gray-600 mb-6">{enrollment.training.description}</p>

            {/* Barre de progression globale */}
            <div className="bg-white p-6 rounded-lg shadow mb-6">
                <div className="flex justify-between mb-2 text-sm">
                    <span className="font-medium text-gray-700">Progression globale</span>
                    <span className="font-bold text-green-700">{progressPercent}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                    <div className="bg-green-600 h-3 rounded-full transition-all"
                        style={{ width: `${progressPercent}%` }}></div>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                    {completedCount} / {totalChapters} chapitres terminés
                </p>
            </div>

            {/* Navigation entre chapitres */}
            <div className="bg-white p-4 rounded-lg shadow mb-6 overflow-x-auto">
                <div className="flex gap-2">
                    {chapters.map((chap, idx) => {
                        const isCompleted = completedIds.includes(chap.id);
                        const isCurrent = idx === currentIndex;
                        return (
                            <button
                                key={chap.id}
                                onClick={() => setCurrentIndex(idx)}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition whitespace-nowrap ${
                                    isCurrent ? 'bg-blue-600 text-white' :
                                    isCompleted ? 'bg-green-100 text-green-700 border border-green-300' :
                                    'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                            >
                                {isCompleted ? '✅' : isCurrent ? '📖' : '📄'} Chapitre {idx + 1}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Contenu du chapitre courant */}
            <div className="bg-white p-4 md:p-8 rounded-lg shadow mb-6">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-blue-900">
                        {currentChapter.title}
                    </h2>
                    {isCurrentCompleted && (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                            ✅ Terminé
                        </span>
                    )}
                </div>

                <div className="prose max-w-none text-gray-700 whitespace-pre-wrap leading-relaxed">
                    {currentChapter.content}
                </div>
            </div>

            {message && (
                <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-lg text-center font-medium">
                    {message}
                </div>
            )}

            {/* Boutons de navigation */}
            <div className="flex justify-between items-center">
                <button
                    onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                    disabled={currentIndex === 0}
                    className={`px-4 py-2 rounded-lg font-medium ${
                        currentIndex === 0
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gray-600 text-white hover:bg-gray-700'
                    }`}
                >
                    ← Précédent
                </button>

                {!isCurrentCompleted ? (
                    <button
                        onClick={markChapterComplete}
                        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 font-bold"
                    >
                        ✅ J'ai terminé ce chapitre
                    </button>
                ) : (
                    <span className="text-green-700 font-bold">Chapitre validé ✓</span>
                )}

                <button
                    onClick={() => setCurrentIndex(Math.min(chapters.length - 1, currentIndex + 1))}
                    disabled={currentIndex === chapters.length - 1}
                    className={`px-4 py-2 rounded-lg font-medium ${
                        currentIndex === chapters.length - 1
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    Suivant →
                </button>
            </div>

            {/* Bouton Quiz quand tout est fini */}
            {progressPercent === 100 && enrollment.status !== 'COMPLETED' && (
                <div className="mt-8 text-center">
                    <button
                        onClick={() => navigate(`/employee/quiz/${enrollmentId}`)}
                        className="bg-purple-600 text-white px-8 py-3 rounded-lg hover:bg-purple-700 font-bold text-lg"
                    >
                        🎓 Passer le Quiz final
                    </button>
                </div>
            )}
        </div>
    );
};

export default LearningPage;