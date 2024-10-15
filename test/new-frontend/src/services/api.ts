import axios from 'axios';

// Création d'une instance Axios
const api = axios.create({
    baseURL: 'http://localhost:3000', // URL de base de votre backend
});

// Intercepteur de requête pour ajouter le token JWT
api.interceptors.request.use(
    (config: any) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            window.location.href = '/'; // Redirection vers la page d'accueil si pas de token
        }
        return config;
    },
    (error: any) => Promise.reject(error)
);

export default api;