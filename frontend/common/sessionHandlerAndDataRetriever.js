// Configuration d'Axios pour inclure automatiquement le token JWT dans les requêtes
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

// Récupère et stocke les informations utilisateur dans le localStorage
async function fetchUserFromBackend() {
    console.log("Fetching user data from backend...");
    try {
        const response = await axios.get('http://localhost:3000/users/my-profile');
        const userData = response.data;
        localStorage.setItem('user', JSON.stringify(userData));
        console.log("User data successfully fetched and stored.");
        return userData;
    } catch (error) {
        console.error("Error fetching user data:", error);
        return null;
    }
}

// Récupère et stocke les informations du dinosaure dans le localStorage
async function fetchDinosaurFromBackend() {
    console.log("Fetching dinosaur data from backend...");
    try {
        const response = await axios.get('http://localhost:3000/dinosaurs/my-dinosaur');
        const dinosaurData = response.data;
        localStorage.setItem('dinosaur', JSON.stringify(dinosaurData));
        console.log("Dinosaur data successfully fetched and stored.");
        return dinosaurData;
    } catch (error) {
        console.error("Error fetching dinosaur data:", error);
        return null;
    }
}

// Initialise la session lors du chargement de la page
async function initializeSession() {
    console.log("Initializing session...");
    try {
        await Promise.all([fetchUserFromBackend(), fetchDinosaurFromBackend()]);
        console.log("Session initialized successfully.");
    } catch (error) {
        console.error("Error initializing session:", error);
        localStorage.clear();
        window.location.href = '../../index.html';
    }
}

// Appel de la fonction d'initialisation lors du chargement de la page
document.addEventListener('DOMContentLoaded', initializeSession);
