import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosClient from '../../api/axiosClient';
console.log('🚀🚀🚀 ManageChapters.jsx CHARGÉ !');

const ManageChapters = () => {
    const { trainingId } = useParams();
    const navigate = useNavigate();
    const [chapters, setChapters] = useState([]);
    const [message, setMessage] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState({ title: '', content: '' });
    const [showForm, setShowForm] = useState(false);

    const loadChapters = async () => {
        try {
            const res = await axiosClient.get(`/trainer/training/${trainingId}/chapters`);
            setChapters(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { loadChapters(); }, [trainingId]);

    const resetForm = () => {
        setFormData({ title: '', content: '' });
        setEditingId(null);
        setShowForm(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            if (editingId) {
                await axiosClient.put(`/trainer/chapter/${editingId}`, formData);
                setMessage('✅ Chapitre mis à jour');
            } else {
                await axiosClient.post(`/trainer/training/${trainingId}/chapter`, formData);
                setMessage('✅ Chapitre ajouté');
            }
            resetForm();
            loadChapters();
        } catch (err) {
            setMessage('❌ Erreur : ' + err.message);
        }
    };

    const handleEdit = (chapter) => {
        setEditingId(chapter.id);
        setFormData({ title: chapter.title, content: chapter.content });
        setShowForm(true);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Voulez-vous vraiment supprimer ce chapitre ?')) return;
        try {
            await axiosClient.delete(`/trainer/chapter/${id}`);
            setMessage('✅ Chapitre supprimé');
            loadChapters();
        } catch (err) {
            setMessage('❌ Erreur suppression');
        }
    };

    return (
        <div className="p-4 md:p-8">
            <button onClick={() => navigate('/trainer')}
                className="text-purple-600 hover:underline mb-4">
                ← Retour au tableau de bord
            </button>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-purple-900">Gestion des chapitres</h1>
                <button
                    onClick={() => { resetForm(); setShowForm(!showForm); }}
                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-medium"
                >
                    {showForm ? '✕ Annuler' : '+ Ajouter un chapitre'}
                </button>
            </div>

            {message && (
                <div className={`mb-4 p-3 rounded-lg text-center font-medium ${
                    message.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>{message}</div>
            )}

            {/* Formulaire */}
            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow mb-6 border-l-4 border-purple-500">
                    <h2 className="text-xl font-bold mb-4">
                        {editingId ? 'Modifier le chapitre' : 'Nouveau chapitre'}
                    </h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input
                            required
                            placeholder="Titre du chapitre"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full border p-2 rounded-lg focus:outline-none focus:border-purple-500"
                        />
                        <textarea
                            required
                            placeholder="Contenu du chapitre"
                            value={formData.content}
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                            rows="6"
                            className="w-full border p-2 rounded-lg focus:outline-none focus:border-purple-500"
                        />
                        <button type="submit"
                            className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 font-medium">
                            {editingId ? 'Enregistrer les modifications' : 'Ajouter le chapitre'}
                        </button>
                    </form>
                </div>
            )}

            {/* Liste des chapitres */}
            {chapters.length === 0 ? (
                <p className="text-gray-500 italic bg-white p-4 rounded-lg shadow-sm">
                    Aucun chapitre pour le moment. Cliquez sur "Ajouter un chapitre" pour commencer.
                </p>
            ) : (
                <div className="space-y-3">
                    {chapters.map((c, idx) => (
                        <div key={c.id} className="bg-white p-5 rounded-lg shadow">
                            <div className="flex justify-between items-start mb-2">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">
                                            Chapitre {idx + 1}
                                        </span>
                                        <h3 className="font-bold text-lg">{c.title}</h3>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEdit(c)}
                                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm">
                                        ✏️ Modifier
                                    </button>
                                    <button onClick={() => handleDelete(c.id)}
                                        className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm">
                                        🗑️ Supprimer
                                    </button>
                                </div>
                            </div>
                            <p className="text-gray-600 text-sm mt-2 whitespace-pre-wrap">{c.content}</p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ManageChapters;