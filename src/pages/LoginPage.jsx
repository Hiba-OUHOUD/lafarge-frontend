import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Envoi d'un POST JSON
            const response = await axiosClient.post('/auth/login', { email, password });
            const { token, user } = response.data;

            // Sauvegarder dans le contexte
            login(user, token);

            // Redirection selon le rôle
            if (user.role === 'ADMIN') navigate('/admin');
            else if (user.role === 'TRAINER') navigate('/trainer');
            else navigate('/employee');

        } catch (err) {
            if (err.response?.status === 401) {
                setError('Email ou mot de passe incorrect');
            } else {
                setError('Erreur de connexion au serveur');
            }
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-800 p-4">
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-2xl w-full max-w-md">
                <h1 className="text-3xl font-bold mb-2 text-center text-blue-700">
                    Lafarge
                </h1>
                <p className="text-center text-gray-500 mb-6">E-Learning Platform</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2 font-medium">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="votre@email.com"
                            required
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 mb-2 font-medium">Mot de passe</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
                    <button
                        type="submit"
                        disabled={loading}
                        className={`w-full py-2 rounded-lg font-medium text-white transition ${
                            loading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700'
                        }`}
                    >
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </button>
                    <div className="mt-6 text-center text-sm text-gray-600">
                        Pas encore de compte ?{' '}
                        <Link to="/register" className="text-blue-600 hover:underline font-medium">
                            Créer un compte
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;