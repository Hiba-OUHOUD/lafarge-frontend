import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';

const DOMAINS = [
    'ÉLECTRICITÉ', 'BÉTON', 'MÉCANIQUE', 'SÉCURITÉ', 'LOGISTIQUE',
    'RH', 'ADMINISTRATION', 'CIMENT', 'GENERAL'
];

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
        domain: 'GENERAL',
        position: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        // Vérifier que les mots de passe correspondent
        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }

        if (formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        setLoading(true);

        try {
            const response = await axiosClient.post('/auth/register', {
                firstName: formData.firstName,
                lastName: formData.lastName,
                email: formData.email,
                password: formData.password,
                domain: formData.domain,
                position: formData.position
            });

            const { token, user } = response.data;

            // Connecter automatiquement l'utilisateur
            login(user, token);

            // Rediriger vers l'espace employé
            navigate('/employee');

        } catch (err) {
            if (err.response?.status === 409) {
                setError('Cet email est déjà utilisé');
            } else if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else {
                setError('Erreur lors de la création du compte');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 to-green-800 p-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-md">
                <h1 className="text-3xl font-bold mb-2 text-center text-green-700">
                    Lafarge
                </h1>
                <p className="text-center text-gray-500 mb-6">Créer un compte</p>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div>
                            <label className="block text-gray-700 mb-1 text-sm font-medium">Prénom</label>
                            <input
                                type="text"
                                value={formData.firstName}
                                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 mb-1 text-sm font-medium">Nom</label>
                            <input
                                type="text"
                                value={formData.lastName}
                                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                                required
                            />
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1 text-sm font-medium">Email</label>
                        <input
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                            placeholder="votre@lafarge.com"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1 text-sm font-medium">Mot de passe</label>
                        <input
                            type="password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1 text-sm font-medium">Confirmer le mot de passe</label>
                        <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1 text-sm font-medium">Domaine</label>
                        <select
                            value={formData.domain}
                            onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                        >
                            {DOMAINS.map(d => (
                                <option key={d} value={d}>{d}</option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-1 text-sm font-medium">Poste (optionnel)</label>
                        <input
                            type="text"
                            value={formData.position}
                            onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                            placeholder="Ex: Ingénieur Mécanique"
                        />
                    </div>

                    {error && (
                        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded-lg font-medium text-white transition ${
                            loading
                                ? 'bg-gray-400 cursor-not-allowed'
                                : 'bg-green-600 hover:bg-green-700'
                        }`}
                    >
                        {loading ? 'Création en cours...' : 'Créer mon compte'}
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-gray-600">
                    Vous avez déjà un compte ?{' '}
                    <Link to="/login" className="text-green-600 hover:underline font-medium">
                        Se connecter
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;