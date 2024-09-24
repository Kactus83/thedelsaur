// Variables des éléments HTML
const overlay = document.getElementById('overlay');
const loginFormContainer = document.getElementById('login-form');
const signupFormContainer = document.getElementById('signup-form');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');

// Conteneurs pour les messages
const loginMessage = document.getElementById('login-message');
const signupMessage = document.getElementById('signup-message');

/**
 * Configuration d'Axios pour inclure automatiquement le token JWT dans les en-têtes des requêtes.
 */
axios.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            console.log('Token ajouté aux headers:', token);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Fonction pour afficher un formulaire avec une animation.
 * @param {HTMLElement} formContainer - Le conteneur du formulaire à afficher.
 */
function showForm(formContainer) {
    formContainer.style.display = 'block';
    setTimeout(() => {
        formContainer.classList.add('show');
    }, 10); // Petit délai pour permettre l'animation CSS
}

/**
 * Fonction pour masquer un formulaire avec une animation.
 * @param {HTMLElement} formContainer - Le conteneur du formulaire à masquer.
 */
function hideForm(formContainer) {
    formContainer.classList.remove('show');
    setTimeout(() => {
        formContainer.style.display = 'none';
    }, 500); // Correspond à la durée de la transition CSS
}

/**
 * Fonction pour effacer les messages d'erreur et de succès.
 */
function clearMessages() {
    [loginMessage, signupMessage].forEach(message => {
        message.style.display = 'none';
        message.textContent = '';
        message.classList.remove('success', 'error');
    });
}

/**
 * Fonction pour afficher un message avec une animation.
 * @param {HTMLElement} element - L'élément où afficher le message.
 * @param {string} message - Le texte du message.
 * @param {string} type - Le type du message ('success' ou 'error').
 */
function showMessage(element, message, type) {
    element.textContent = message;
    element.classList.add(type);
    element.style.display = 'block';
    setTimeout(() => {
        element.classList.add('show');
    }, 10); // Petit délai pour permettre l'animation CSS
}

/**
 * Fonction pour afficher les formulaires avec les animations appropriées.
 */
function setupFormToggle() {
    // Ouvrir le formulaire de connexion
    document.getElementById('btn-login').addEventListener('click', () => {
        overlay.classList.add('show');
        hideForm(signupFormContainer);
        showForm(loginFormContainer);
        clearMessages();
    });

    // Ouvrir le formulaire d'inscription
    document.getElementById('btn-signup').addEventListener('click', () => {
        overlay.classList.add('show');
        hideForm(loginFormContainer);
        showForm(signupFormContainer);
        clearMessages();
    });

    // Fermer le formulaire de connexion
    document.getElementById('close-login').addEventListener('click', () => {
        overlay.classList.remove('show');
        hideForm(loginFormContainer);
        clearMessages();
    });

    // Fermer le formulaire d'inscription
    document.getElementById('close-signup').addEventListener('click', () => {
        overlay.classList.remove('show');
        hideForm(signupFormContainer);
        clearMessages();
    });
}

/**
 * Gestion du formulaire de connexion.
 */
function handleLogin() {
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
            console.log('Token stocké dans localStorage:', localStorage.getItem('token'));

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
}

/**
 * Gestion du formulaire d'inscription.
 */
function handleSignup() {
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

            // Effacement des champs du formulaire d'inscription
            signupForm.reset();

            // Transition vers le formulaire de connexion après un délai
            setTimeout(() => {
                hideForm(signupFormContainer);
                showForm(loginFormContainer);
                clearMessages();

                // Pré-remplir l'email dans le formulaire de connexion
                document.getElementById('login-email').value = email;

                // Afficher le message de succès dans le formulaire de connexion
                showMessage(loginMessage, 'Inscription réussie ! Veuillez vous connecter.', 'success');
            }, 2000); // Attendre 2 secondes avant de basculer

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
}

/**
 * Initialisation de l'application frontend.
 */
function init() {
    setupFormToggle();
    handleLogin();
    handleSignup();
}

// Appel de la fonction d'initialisation lorsque la page est chargée
document.addEventListener('DOMContentLoaded', init);
