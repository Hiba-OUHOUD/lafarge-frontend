import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { SkeletonTrainingGrid } from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';

const DOMAINS = [
    'ÉLECTRICITÉ', 'BÉTON', 'MÉCANIQUE', 'SÉCURITÉ', 'LOGISTIQUE',
    'RH', 'ADMINISTRATION', 'CIMENT', 'GENERAL'
];

const AdminTrainings = () => {
    const [trainings, setTrainings] = useState([]);
    const [trainers, setTrainers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterStatus, setFilterStatus] = useState('');
    const [filterDomain, setFilterDomain] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        title: '', description: '', content: '', domain: 'ÉLECTRICITÉ', createdBy: { id: 1 }
    });
    const [message, setMessage] = useState('');

    const loadTrainings = async () => {
        try {
            setLoading(true);
            const res = await axiosClient.get('/trainings');
            setTrainings(res.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const loadTrainers = async () => {
        try {
            const res = await axiosClient.get('/admin/users');
            setTrainers(res.data.filter(u => u.role === 'TRAINER'));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => { loadTrainings(); loadTrainers(); }, []);
    const handleDelete = async (training) => {
        const confirmed = window.confirm(
            `⚠️ Êtes-vous sûr de vouloir supprimer la formation "${training.title}" ?\n\n` +
            `Cette action est irréversible et supprimera également :\n` +
            `- Tous ses chapitres\n` +
            `- Son quiz et ses questions\n` +
            `- Toutes les inscriptions associées\n` +
            `- Tous les résultats et certificats`
        );

        if (!confirmed) return;

        try {
            await axiosClient.delete(`/trainings/${training.id}`);
            setMessage(`✅ Formation "${training.title}" supprimée`);
            loadTrainings();
        } catch (err) {
            console.error(err);
            setMessage('❌ Erreur : ' + (err.response?.data?.error || err.message));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosClient.post('/trainings', formData);
            setMessage('✅ Formation créée');
            setShowForm(false);
            setFormData({ title: '', description: '', content: '', domain: 'ÉLECTRICITÉ', createdBy: { id: 1 } });
            loadTrainings();
        } catch (err) {
            setMessage('❌ Erreur : ' + err.message);
        }
    };

    const publishTraining = async (id) => {
        try {
            await axiosClient.put(`/trainings/${id}/publish`);
            setMessage('✅ Formation publiée');
            loadTrainings();
        } catch (err) {
            setMessage('❌ Erreur publication');
        }
    };

    const assignTrainer = async (trainingId, trainerId) => {
        try {
            await axiosClient.put(`/trainings/${trainingId}/assign/${trainerId}`);
            setMessage('✅ Formateur assigné');
            loadTrainings();
        } catch (err) {
            setMessage('❌ Erreur assignation');
        }
    };

    const filteredTrainings = trainings.filter(t => {
        const matchSearch = `${t.title} ${t.description}`.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !filterStatus || t.status === filterStatus;
        const matchDomain = !filterDomain || t.domain === filterDomain;
        return matchSearch && matchStatus && matchDomain;
    });

    const resetFilters = () => {
        setSearch('');
        setFilterStatus('');
        setFilterDomain('');
    };

    return (
        <div className="p-4 md:p-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-blue-900">Gestion des Formations</h1>
                    <p className="text-gray-600 mt-1">
                        {filteredTrainings.length} formation(s) affichée(s) sur {trainings.length}
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                        showForm ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
                >
                    {showForm ? '✕ Annuler' : '+ Créer une formation'}
                </button>
            </div>

            {message && (
                <div className={`mb-4 p-3 rounded-lg text-center font-medium ${
                    message.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>{message}</div>
            )}

            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow mb-6 border-l-4 border-blue-500">
                    <h2 className="text-xl font-bold mb-4 text-blue-900">Nouvelle formation</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input required placeholder="Titre" value={formData.title}
                            onChange={(e) => setFormData({...formData, title: e.target.value})}
                            className="w-full border p-2 rounded-lg focus:outline-none focus:border-blue-500" />
                        <textarea required placeholder="Description" value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            className="w-full border p-2 rounded-lg focus:outline-none focus:border-blue-500" rows="2" />
                        <textarea required placeholder="Contenu" value={formData.content}
                            onChange={(e) => setFormData({...formData, content: e.target.value})}
                            className="w-full border p-2 rounded-lg focus:outline-none focus:border-blue-500" rows="4" />
                        <select value={formData.domain}
                            onChange={(e) => setFormData({...formData, domain: e.target.value})}
                            className="w-full border p-2 rounded-lg focus:outline-none focus:border-blue-500">
                            {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <button type="submit" className="bg-green-600 text-white py-2 px-6 rounded-lg hover:bg-green-700 font-medium">
                            Créer la formation
                        </button>
                    </form>
                </div>
            )}

            {/* Barre de filtres */}
            <div className="bg-white p-4 rounded-lg shadow mb-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                        <label className="block text-xs text-gray-600 mb-1">Recherche</label>
                        <input type="text" placeholder="🔍 Titre ou description..."
                            value={search} onChange={(e) => setSearch(e.target.value)}
                            className="w-full border p-2 rounded-lg focus:outline-none focus:border-blue-500" />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Statut</label>
                        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}
                            className="w-full border p-2 rounded-lg focus:outline-none focus:border-blue-500">
                            <option value="">Tous les statuts</option>
                            <option value="PUBLISHED">Publiées</option>
                            <option value="DRAFT">Brouillons</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Domaine</label>
                        <select value={filterDomain} onChange={(e) => setFilterDomain(e.target.value)}
                            className="w-full border p-2 rounded-lg focus:outline-none focus:border-blue-500">
                            <option value="">Tous les domaines</option>
                            {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>
                {(search || filterStatus || filterDomain) && (
                    <button onClick={resetFilters} className="mt-3 text-sm text-blue-600 hover:underline">
                        ✕ Réinitialiser les filtres
                    </button>
                )}
            </div>

            {/* Liste des formations */}
            {loading ? (
                <SkeletonTrainingGrid count={4} />
            ) : filteredTrainings.length === 0 ? (
                <EmptyState
                    icon="📚"
                    title="Aucune formation trouvée"
                    description="Aucune formation ne correspond à vos critères de recherche."
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredTrainings.map((t) => (
                        <div key={t.id} className="bg-white p-6 rounded-lg shadow">
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold flex-1">{t.title}</h3>
                                <span className={`px-2 py-1 rounded text-xs font-bold ml-2 ${
                                    t.status === 'PUBLISHED' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                                }`}>{t.status}</span>
                            </div>
                            <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                                {t.domain || 'GENERAL'}
                            </span>
                            <p className="text-gray-600 text-sm mt-3 mb-4">{t.description}</p>
                            <p className="text-sm mb-4">
                                <strong>Formateur :</strong> {t.trainer ? `${t.trainer.firstName} ${t.trainer.lastName}` : 'Non assigné'}
                            </p>
                            
                            <div className="flex gap-2 flex-wrap">
                                {t.status === 'DRAFT' && (
                                    <button onClick={() => publishTraining(t.id)}
                                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700">
                                        Publier
                                    </button>
                                )}
                                <select
                                    onChange={(e) => assignTrainer(t.id, e.target.value)}
                                    className="border rounded px-2 py-1 text-sm"
                                    value={t.trainer?.id || ''}
                                >
                                    <option value="">-- Assigner un formateur --</option>
                                    {trainers.map(tr => (
                                        <option key={tr.id} value={tr.id}>{tr.firstName} {tr.lastName}</option>
                                    ))}
                                </select>
                                <button
                                    onClick={() => handleDelete(t)}
                                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                                    title="Supprimer cette formation"
                                >
                                    🗑️
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminTrainings;