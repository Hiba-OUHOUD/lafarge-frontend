import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';

const QuizPage = () => {
    const { enrollmentId } = useParams();
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const loadQuiz = async () => {
            try {
                // 1. Récupérer l'inscription pour connaître la formation
                const enrRes = await axiosClient.get(`/employee/enrollment/${enrollmentId}`);
                const trainingId = enrRes.data.training.id;

                // 2. Récupérer les questions du quiz de cette formation
                const qRes = await axiosClient.get(`/employee/quiz/questions/${trainingId}`);
                setQuestions(qRes.data);
            } catch (err) {
                console.error(err);
                setError('Impossible de charger le quiz. Aucune question disponible pour cette formation.');
            } finally {
                setLoading(false);
            }
        };
        loadQuiz();
    }, [enrollmentId]);

    const handleSubmit = async () => {
        setError('');
        if (Object.keys(answers).length === 0) {
            setError('Veuillez répondre à au moins une question.');
            return;
        }

        try {
            const res = await axiosClient.post(
                `/employee/quiz/submit?enrollmentId=${enrollmentId}`,
                { answers }
            );
            setResult(res.data);
        } catch (err) {
            console.error(err);
            setError('Erreur lors de la soumission : ' + (err.response?.data?.error || err.message));
        }
    };

    if (loading) return <div className="p-8 text-center">Chargement du quiz...</div>;

    if (error && questions.length === 0) {
        return (
            <div className="p-8 max-w-2xl mx-auto text-center">
                <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                    <p className="text-red-700 mb-4">{error}</p>
                    <button onClick={() => navigate('/employee/my-learnings')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                        ← Retour
                    </button>
                </div>
            </div>
        );
    }

    if (result) {
        return (
            <div className="p-8 max-w-2xl mx-auto">
                <div className={`p-8 rounded-lg shadow text-center ${result.passed ? 'bg-green-50' : 'bg-red-50'}`}>
                    <h1 className="text-4xl font-bold mb-4">
                        {result.passed ? '🎉 Félicitations !' : '😔 Échec'}
                    </h1>
                    <p className="text-3xl mb-2 font-bold">Score : {result.score}%</p>
                    <p className="mb-6 text-gray-700">
                        {result.passed 
                            ? 'Vous avez réussi le quiz ! Votre certificat est prêt.' 
                            : 'Vous devez obtenir au moins 70%. Réessayez.'}
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button onClick={() => navigate('/employee/my-learnings')}
                            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                            Retour
                        </button>
                        {!result.passed && (
                            <button onClick={() => { setResult(null); setAnswers({}); }}
                                className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700">
                                Réessayer
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold text-purple-900 mb-2">Quiz</h1>
            <p className="text-gray-600 mb-8">{questions.length} question(s) — Seuil de réussite : 70%</p>

            {questions.map((q, idx) => (
                <div key={q.id} className="bg-white p-6 rounded-lg shadow mb-4">
                    <p className="font-bold mb-4">
                        {idx + 1}. {q.questionText}
                    </p>
                    {['A', 'B', 'C', 'D'].map((opt) => {
                        const optionKey = `option${opt}`;
                        return (
                            <label key={opt} className="block mb-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                <input
                                    type="radio"
                                    name={`q${q.id}`}
                                    value={opt}
                                    checked={answers[q.id] === opt}
                                    onChange={() => setAnswers({ ...answers, [q.id]: opt })}
                                    className="mr-2"
                                />
                                <span className="font-bold mr-2">{opt}.</span>
                                {q[optionKey]}
                            </label>
                        );
                    })}
                </div>
            ))}

            {error && (
                <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
            )}

            <button
                onClick={handleSubmit}
                className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-bold text-lg"
            >
                Soumettre le Quiz
            </button>
        </div>
    );
};

export default QuizPage;