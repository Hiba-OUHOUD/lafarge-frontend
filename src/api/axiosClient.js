import axios from 'axios';

const axiosClient = axios.create({
    baseURL: '/lafarge-backend/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// INTERCEPTEUR DE REQUÊTE : Ajoute le token JWT à chaque appel
axiosClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// INTERCEPTEUR DE RÉPONSE : Gère les 401 (token expiré)
axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // ⚠️ NE PAS supprimer le token automatiquement sur les pages protégées
            // On affiche juste une erreur, l'utilisateur reste sur sa page
            console.warn('⚠️ Requête non autorisée (401) :', error.config.url);
        }
        return Promise.reject(error);
    }
);

export default axiosClient;