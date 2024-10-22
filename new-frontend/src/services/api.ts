import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// Création d'une instance Axios avec une configuration de base
const api = axios.create({
    baseURL: 'http://localhost:3000/', // URL de base de votre backend
    headers: {
        'Content-Type': 'application/json', // Type de contenu par défaut
    },
    timeout: 10000, // Temps d'attente maximal pour une requête (en ms)
});

// Liste des routes à exclure de l'intercepteur
const excludedRoutes = [
    '/auth/login',
    '/auth/signup',
    '/auth/verify-token'
];

// Intercepteur de requête pour ajouter le token JWT
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token'); // Récupération du token depuis le localStorage

        // Vérifier si l'URL de la requête doit être exclue de l'intercepteur
        const isExcluded = excludedRoutes.some(route => config.url?.startsWith(route));

        if (isExcluded) {
            // Ignorer l'ajout du token pour les routes d'authentification
            return config;
        }

        if (token) {
            // Ajout du token JWT dans l'en-tête Authorization si présent
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            // Si le token est absent, redirection vers la page de connexion
            window.location.href = '/login';
        }

        return config;
    },
    (error: AxiosError) => {
        // Gestion des erreurs de requête
        return Promise.reject(error);
    }
);

// Intercepteur de réponse pour gérer les erreurs 401 (token invalide ou expiré)
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            // Supprimer le token
            localStorage.removeItem('token');
            // Rediriger vers la page de connexion
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;
