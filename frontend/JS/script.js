// Variables des éléments HTML
const overlay = document.getElementById('overlay');
const loginFormContainer = document.getElementById('login-form');
const signupFormContainer = document.getElementById('signup-form');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Conteneurs pour les messages
const loginMessage = document.getElementById('login-message');
const signupMessage = document.getElementById('signup-message');

// Configuration d'Axios pour inclure automatiquement le token JWT
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Boutons pour ouvrir les formulaires
document.getElementById('btn-login').addEventListener('click', () => {
    overlay.classList.add('show');
    loginFormContainer.style.display = 'block';
    signupFormContainer.style.display = 'none';
    clearMessages();
});

document.getElementById('btn-signup').addEventListener('click', () => {
    overlay.classList.add('show');
    signupFormContainer.style.display = 'block';
    loginFormContainer.style.display = 'none';
    clearMessages();
});

// Boutons pour fermer les formulaires
document.getElementById('close-login').addEventListener('click', () => {
    overlay.classList.remove('show');
    loginFormContainer.style.display = 'none';
    clearMessages();
});

document.getElementById('close-signup').addEventListener('click', () => {
    overlay.classList.remove('show');
    signupFormContainer.style.display = 'none';
    clearMessages();
});

// Fonction pour effacer les messages
function clearMessages() {
    loginMessage.style.display = 'none';
    signupMessage.style.display = 'none';
    loginMessage.textContent = '';
    signupMessage.textContent = '';
    loginMessage.classList.remove('success', 'error');
    signupMessage.classList.remove('success', 'error');
}

// Gestion du formulaire de login
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value.trim();
    const password = document.getElementById('login-password').value.trim();

    try {
        // Envoi de la requête de connexion
        const response = await axios.post('http://localhost:3000/auth/login', {
            email,
            password
        });

        const data = response.data;
        console.log('Token:', data.token);

        // Stockage du token JWT
        localStorage.setItem('token', data.token);

        // Redirection vers la page principale
        window.location.href = './pages/Idlesaur.html'; 

    } catch (error) {
        // Affichage des messages d'erreur
        if (error.response) {
            showMessage(loginMessage, 'Erreur de connexion : ' + error.response.data.message, 'error');
        } else {
            console.error('Erreur:', error);
            showMessage(loginMessage, 'Erreur de connexion : Veuillez réessayer plus tard.', 'error');
        }
    }
});

// Gestion du formulaire d'inscription
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();

    try {
        // Envoi de la requête d'inscription
        const response = await axios.post('http://localhost:3000/auth/signup', {
            username,
            email,
            password
        });

        const data = response.data;
        console.log('User:', data.user);

        // Affichage du message de succès
        showMessage(signupMessage, 'Inscription réussie ! Vous pouvez maintenant vous connecter.', 'success');

        // Affichage du formulaire de connexion après un délai
        setTimeout(() => {
            overlay.classList.add('show');
            loginFormContainer.style.display = 'block';
            signupFormContainer.style.display = 'none';
            clearMessages();
            showMessage(loginMessage, 'Inscription réussie ! Veuillez vous connecter.', 'success');
        }, 2000);

    } catch (error) {
        // Affichage des messages d'erreur
        if (error.response) {
            showMessage(signupMessage, 'Erreur d\'inscription : ' + error.response.data.message, 'error');
        } else {
            console.error('Erreur:', error);
            showMessage(signupMessage, 'Erreur d\'inscription : Veuillez réessayer plus tard.', 'error');
        }
    }
});

// Fonction pour afficher les messages
function showMessage(element, message, type) {
    element.textContent = message;
    element.classList.add(type);
    element.style.display = 'block';
}
