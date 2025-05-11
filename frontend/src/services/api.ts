import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Création d'une instance Axios avec une configuration de base
const api = axios.create({
    //baseURL: "https://9kgui6fkgx.eu-west-3.awsapprunner.com/", POUR LA PROD
    baseURL: "http://localhost:3000",
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});


// Intercepteur de requête pour ajouter le token JWT
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('token'); // Récupération du token depuis le localStorage
        if (token) {
            // Ajout du token JWT dans l'en-tête Authorization
            config.headers = config.headers || {};
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        // Gestion des erreurs de requête
        return Promise.reject(error);
    }
    
);
// Configuration d'Axios pour inclure automatiquement le token JWT
    axios.interceptors.request.use(
        (config) => {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }else{
                window.location.href = '../../index.html';
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
);
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        } else {
            window.location.href = '../../index.html'; // Redirection vers la page de login si pas de token
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;



