const authService = require('../services/authService');

/**
 * Contrôleur pour l'inscription.
 * Crée un utilisateur et un dinosaure associé.
 * @param {Object} req - La requête Express.
 * @param {Object} res - La réponse Express.
 */
const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Vérifier que tous les champs sont fournis
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email et password sont requis' });
    }

    const { user, dinosaur } = await authService.signup(username, email, password);
    res.status(201).json({ message: 'Utilisateur créé avec succès', user, dinosaur });
  } catch (error) {
    console.error('Erreur lors de l\'inscription:', error);
    res.status(400).json({ message: error.message });
  }
};

/**
 * Contrôleur pour la connexion.
 * Authentifie un utilisateur et renvoie un token JWT.
 * @param {Object} req - La requête Express.
 * @param {Object} res - La réponse Express.
 */
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Vérifier que tous les champs sont fournis
    if (!email || !password) {
      return res.status(400).json({ message: 'Email et password sont requis' });
    }

    const data = await authService.login(email, password);
    res.status(200).json({ message: 'Connexion réussie', token: data.token, user: data.user });
  } catch (error) {
    console.error('Erreur lors de la connexion:', error);
    res.status(401).json({ message: error.message });
  }
};

module.exports = {
  signup,
  login
};