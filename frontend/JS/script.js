// Variables des éléments HTML
const overlay = document.getElementById('overlay');
const loginForm = document.getElementById('login-form');
const signupForm = document.getElementById('signup-form');

// Boutons pour ouvrir les formulaires
document.getElementById('btn-login').addEventListener('click', () => {
    overlay.classList.add('show');
    loginForm.style.display = 'block';
    signupForm.style.display = 'none';
});

document.getElementById('btn-signup').addEventListener('click', () => {
    overlay.classList.add('show');
    signupForm.style.display = 'block';
    loginForm.style.display = 'none';
});

// Boutons pour fermer les formulaires
document.getElementById('close-login').addEventListener('click', () => {
    overlay.classList.remove('show');
    loginForm.style.display = 'none';
});

document.getElementById('close-signup').addEventListener('click', () => {
    overlay.classList.remove('show');
    signupForm.style.display = 'none';
});

// Gestion du formulaire de login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('http://localhost:3000/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Connexion réussie !');
            console.log('Token:', data.token);
        } else {
            alert('Erreur de connexion: ' + data.message);
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
});

// Gestion du formulaire d'inscription
document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('signup-username').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    try {
        const response = await fetch('http://localhost:3000/auth/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, email, password }),
        });

        const data = await response.json();
        if (response.ok) {
            alert('Inscription réussie !');
            console.log('User:', data.user);
        } else {
            alert('Erreur d\'inscription: ' + data.message);
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
});
