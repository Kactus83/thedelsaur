import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Création d'une instance Axios avec une configuration de base
const api = axios.create({
    baseURL: 'http://localhost:3000/', // URL de base de votre backend
    headers: {
        'Content-Type': 'application/json', // Type de contenu par défaut
    },
    timeout: 10000, // Temps d'attente maximal pour une requête (en ms)
});

/**
 * Fonction pour vérifier la validité du token JWT.
 * Appelle la route `/auth/verify-token` du backend.
 * @param token - Le token JWT à vérifier.
 * @returns {Promise<boolean>} - Vrai si le token est valide, sinon faux.
 */
const verifyToken = async (token: string): Promise<boolean> => {
    try {
        // Appeler la route de vérification du token sans passer par l'intercepteur
        const response = await axios.post('http://localhost:3000/auth/verify-token', {}, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.status === 200; // Si le backend renvoie 200, le token est valide
    } catch (error) {
        console.error('Token invalide ou expiré:', error);
        return false;
    }
};

// Intercepteur de requête pour ajouter le token JWT et vérifier sa validité à chaque requête
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {

        console.log("check token");
        const token = localStorage.getItem('token'); // Récupération du token depuis le localStorage

        // Ignorer la vérification pour la route de vérification du token elle-même pour éviter les boucles infinies
        if (config.url?.includes('/auth/verify-token')) {
            console.log('-- skip token checking --')
            return config;
        }

        if (token) {
            // Vérifier la validité du token avant d'envoyer la requête
            const isValidToken = await verifyToken(token);
            console.log('is valid token : ', isValidToken);
            if (isValidToken) {
                // Ajout du token JWT dans l'en-tête Authorization si valide
                if (config.headers) {
                    config.headers['Authorization'] = `Bearer ${token}`;
                }
            } else {
                // Si le token est invalide, le supprimer et rediriger vers la page de connexion
                localStorage.removeItem('token');
                window.location.href = '/login';
                return Promise.reject(new AxiosError('Token invalide ou expiré'));
            }
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

export default api;
