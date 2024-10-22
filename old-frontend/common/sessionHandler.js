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

// Fonction pour récupérer le profil utilisateur et afficher le nom dans usersDisplay
async function afficherUtilisateur() {
    try {
        // Envoi de la requête à l'API pour récupérer le profil utilisateur
        const response = await axios.get('http://localhost:3000/users/my-profile');
        
        // Récupération des données utilisateur
        const data = response.data;

        console.log(data);
        
        // Sélection de la div usersDisplay
        const usersDisplay = document.querySelector('#username');
        
        // Affichage du nom d'utilisateur
        usersDisplay.innerHTML = `${data.username}`;
    } 
    catch (error) {
        // Gestion des erreurs avec Axios
        if (error.response) {
            alert('Erreur de connexion: ' + error.response.data.message);
        } else {
            console.error('Erreur:', error);
        }
    }
}

// Appel de la fonction lorsque la page est chargée
document.addEventListener('DOMContentLoaded', afficherUtilisateur);