
const Display = document.getElementsByClassName('usersDiplay');
// Gestion du formulaire de login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
      // Utilisation de Axios pour envoyer la requête de login
      const response = await axios.post('http://localhost:3000/auth/login', {
          email,
          password
      });

      // Axios renvoie les données de réponse dans 'response.data'
      const data = response.data;
      alert('Connexion réussie !');
      console.log('Token:', data.token);
  } catch (error) {
      // Gestion des erreurs avec Axios
      if (error.response) {
          alert('Erreur de connexion: ' + error.response.data.message);
      } else {
          console.error('Erreur:', error);
      }
  }
});

// Gestion du formulaire d'inscription
document.getElementById('signupForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('signup-username').value;
  const email = document.getElementById('signup-email').value;
  const password = document.getElementById('signup-password').value;

  try {
      // Utilisation de Axios pour envoyer la requête d'inscription
      const response = await axios.post('http://localhost:3000/auth/signup', {
          username,
          email,
          password
      });

      // Axios renvoie les données de réponse dans 'response.data'
      const data = response.data;
      alert('Inscription réussie !');
      console.log('User:', data.user);
  } catch (error) {
      // Gestion des erreurs avec Axios
      if (error.response) {
          alert('Erreur d\'inscription: ' + error.response.data.message);
      } else {
          console.error('Erreur:', error);
      }
  }
});