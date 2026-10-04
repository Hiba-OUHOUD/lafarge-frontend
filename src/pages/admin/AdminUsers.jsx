import React, { useState, useEffect } from 'react';
import axiosClient from '../../api/axiosClient';
import { SkeletonTable } from '../../components/Skeleton';
import EmptyState from '../../components/EmptyState';

const DOMAINS = [
    'ÉLECTRICITÉ', 'BÉTON', 'MÉCANIQUE', 'SÉCURITÉ', 'LOGISTIQUE',
    'RH', 'ADMINISTRATION', 'CIMENT', 'GENERAL'
];

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [filterDomain, setFilterDomain] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: '',
        role: 'EMPLOYEE', domain: 'ÉLECTRICITÉ', position: ''
    });
    const [message, setMessage] = useState('');

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8;

    const loadUsers = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/admin/users');
            setUsers(response.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { loadUsers(); }, []);

    useEffect(() => { setCurrentPage(1); }, [search, filterRole, filterDomain]);
    const handleDelete = async (userToDelete) => {
        // Empêcher la suppression de soi-même
        const currentUser = JSON.parse(localStorage.getItem('user'));
        if (currentUser && currentUser.id === userToDelete.id) {
            setMessage('❌ Vous ne pouvez pas supprimer votre propre compte');
            return;
        }

        // Demander confirmation
        const confirmed = window.confirm(
            `⚠️ Êtes-vous sûr de vouloir supprimer "${userToDelete.firstName} ${userToDelete.lastName}" ?\n\n` +
            `Cette action est irréversible et supprimera également :\n` +
            `- Ses inscriptions\n` +
            `- Ses résultats de quiz\n` +
            `- Ses notifications\n` +
            `- Ses certificats`
        );

        if (!confirmed) return;

            try {
                await axiosClient.delete(`/admin/users/${userToDelete.id}`);
                setMessage(`✅ Utilisateur "${userToDelete.firstName} ${userToDelete.lastName}" supprimé`);
                loadUsers();
            } catch (err) {
                    console.error(err);
                    setMessage('❌ Erreur : ' + (err.response?.data?.error || err.message));
            }
        };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        try {
            await axiosClient.post('/admin/users', formData);
            setMessage('✅ Utilisateur créé avec succès');
            setShowForm(false);
            setFormData({
                firstName: '', lastName: '', email: '', password: '',
                role: 'EMPLOYEE', domain: 'ÉLECTRICITÉ', position: ''
            });
            loadUsers();
        } catch (err) {
            setMessage('❌ Erreur : ' + (err.response?.data?.error || 'Email déjà utilisé'));
        }
    };

    // Filtrage
    const filteredUsers = users.filter(u => {
        const matchSearch = `${u.firstName} ${u.lastName} ${u.email} ${u.position || ''}`
            .toLowerCase().includes(search.toLowerCase());
        const matchRole = !filterRole || u.role === filterRole;
        const matchDomain = !filterDomain || u.domain === filterDomain;
        return matchSearch && matchRole && matchDomain;
    });

    // Pagination
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

    const resetFilters = () => {
        setSearch('');
        setFilterRole('');
        setFilterDomain('');
    };

    return (
        <div className="p-4 md:p-8">
            {/* En-tête */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold text-blue-900">Gestion des Utilisateurs</h1>
                    <p className="text-gray-600 mt-1">
                        {filteredUsers.length} utilisateur(s) affiché(s) sur {users.length}
                    </p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                        showForm ? 'bg-gray-500 hover:bg-gray-600' : 'bg-blue-600 hover:bg-blue-700'
                    } text-white`}
                >
                    {showForm ? '✕ Annuler' : '+ Ajouter un utilisateur'}
                </button>
            </div>

            {message && (
                <div className={`mb-4 p-3 rounded-lg text-center font-medium ${
                    message.startsWith('✅') ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>{message}</div>
            )}

            {/* Formulaire */}
            {showForm && (
                <div className="bg-white p-6 rounded-lg shadow-md mb-6 border-l-4 border-blue-500">
                    <h2 className="text-xl font-bold mb-4 text-blue-900">Nouvel utilisateur</h2>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input required placeholder="Prénom" value={formData.firstName}
                            onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                            className="border p-2 rounded-lg focus:outline-none focus:border-blue-500" />
                        <input required placeholder="Nom" value={formData.lastName}
                            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                            className="border p-2 rounded-lg focus:outline-none focus:border-blue-500" />
                        <input required type="email" placeholder="Email" value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="border p-2 rounded-lg focus:outline-none focus:border-blue-500" />
                        <input required type="password" placeholder="Mot de passe" value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="border p-2 rounded-lg focus:outline-none focus:border-blue-500" />
                        <input placeholder="Poste (ex: Ingénieur Électrique)" value={formData.position}
                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                            className="border p-2 rounded-lg focus:outline-none focus:border-blue-500" />
                        <div>
                            <select value={formData.role}
                                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                className="w-full border p-2 rounded-lg focus:outline-none focus:border-blue-500">
                                <option value="EMPLOYEE">Employé</option>
                                <option value="TRAINER">Formateur</option>
                                <option value="ADMIN">Admin</option>
                            </select>
                        </div>
                        <div className="md:col-span-2">
                            <select value={formData.domain}
                                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                                className="w-full border p-2 rounded-lg focus:outline-none focus:border-blue-500">
                                {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                            </select>
                        </div>
                        <button type="submit"
                            className="md:col-span-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 font-medium transition">
                            Créer l'utilisateur
                        </button>
                    </form>
                </div>
            )}

            {/* Barre de filtres */}
            <div className="bg-white p-4 rounded-lg shadow mb-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                    <div className="md:col-span-2">
                        <label className="block text-xs text-gray-600 mb-1">Recherche</label>
                        <input
                            type="text"
                            placeholder="🔍 Nom, email ou poste..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full border p-2 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Rôle</label>
                        <select value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="w-full border p-2 rounded-lg focus:outline-none focus:border-blue-500">
                            <option value="">Tous les rôles</option>
                            <option value="ADMIN">Admin</option>
                            <option value="TRAINER">Formateur</option>
                            <option value="EMPLOYEE">Employé</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-gray-600 mb-1">Domaine</label>
                        <select value={filterDomain}
                            onChange={(e) => setFilterDomain(e.target.value)}
                            className="w-full border p-2 rounded-lg focus:outline-none focus:border-blue-500">
                            <option value="">Tous les domaines</option>
                            {DOMAINS.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                    </div>
                </div>
                {(search || filterRole || filterDomain) && (
                    <button onClick={resetFilters}
                        className="mt-3 text-sm text-blue-600 hover:underline">
                        ✕ Réinitialiser les filtres
                    </button>
                )}
            </div>

            {/* Tableau */}
            {loading ? (
                <SkeletonTable rows={5} cols={6} />
            ) : filteredUsers.length === 0 ? (
                <EmptyState
                    icon="👥"
                    title="Aucun utilisateur trouvé"
                    description="Aucun utilisateur ne correspond à vos critères de recherche."
                />
            ) : (
                <div className="bg-white rounded-lg shadow overflow-x-auto">
                    <table className="w-full min-w-[800px]">
                        <thead className="bg-blue-900 text-white">
                            <tr>
                                <th className="p-3 text-left">ID</th>
                                <th className="p-3 text-left">Nom complet</th>
                                <th className="p-3 text-left">Email</th>
                                <th className="p-3 text-left">Rôle</th>
                                <th className="p-3 text-left">Domaine</th>
                                <th className="p-3 text-left">Poste</th>
                                <th className="p-3 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedUsers.map((u) => (
                                <tr key={u.id} className="border-b hover:bg-gray-50 transition">
                                    <td className="p-3 text-gray-600">{u.id}</td>
                                    <td className="p-3 font-medium">{u.firstName} {u.lastName}</td>
                                    <td className="p-3 text-gray-600">{u.email}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            u.role === 'ADMIN' ? 'bg-red-100 text-red-700' :
                                            u.role === 'TRAINER' ? 'bg-purple-100 text-purple-700' :
                                            'bg-green-100 text-green-700'
                                        }`}>{u.role}</span>
                                    </td>
                                    <td className="p-3">
                                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                                            {u.domain || '-'}
                                        </span>
                                    </td>
                                    <td className="p-3 text-gray-600 text-sm">{u.position || '-'}</td>
                                    <td className="p-3 text-center">
                                        <button
                                            onClick={() => handleDelete(u)}
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-xs font-medium"
                                            title="Supprimer cet utilisateur"
                                        >
                                            🗑️ Supprimer
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-between items-center p-4 bg-gray-50 border-t">
                            <p className="text-sm text-gray-600">
                                Page {currentPage} sur {totalPages}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                    disabled={currentPage === 1}
                                    className={`px-3 py-1 rounded ${
                                        currentPage === 1
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    ← Précédent
                                </button>
                                {Array.from({ length: totalPages }, (_, i) => i + 1)
                                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                                    .map((p, idx, arr) => (
                                        <React.Fragment key={p}>
                                            {idx > 0 && arr[idx - 1] !== p - 1 && (
                                                <span className="px-2 text-gray-400">...</span>
                                            )}
                                            <button
                                                onClick={() => setCurrentPage(p)}
                                                className={`px-3 py-1 rounded ${
                                                    currentPage === p
                                                        ? 'bg-blue-600 text-white font-bold'
                                                        : 'bg-white border hover:bg-gray-100'
                                                }`}
                                            >
                                                {p}
                                            </button>
                                        </React.Fragment>
                                    ))}
                                <button
                                    onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                                    disabled={currentPage === totalPages}
                                    className={`px-3 py-1 rounded ${
                                        currentPage === totalPages
                                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                            : 'bg-blue-600 text-white hover:bg-blue-700'
                                    }`}
                                >
                                    Suivant →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default AdminUsers;