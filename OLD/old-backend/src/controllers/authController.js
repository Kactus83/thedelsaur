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

    console.log('Sign up:', username, email);
    
    // Vérifier que tous les champs sont fournis
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email et password sont requis' });
    }

    let { user, dinosaur } = await authService.signup(username, email, password);
    user.password_hash = "";
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

    console.log('Sign in:', email);

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


/**
 * Contrôleur pour vérifier la validité d'un token JWT.
 * @param {Object} req - La requête Express.
 * @param {Object} res - La réponse Express.
 */
const verifyToken = async (req, res) => {
  try {
    // Récupérer le token depuis l'en-tête Authorization
    const authHeader = req.headers['authorization'];
    if (!authHeader) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    const token = authHeader.split(' ')[1]; // Extraction du token après "Bearer"
    if (!token) {
      return res.status(401).json({ message: 'Token manquant' });
    }

    // Appel au service pour vérifier le token
    const decoded = await authService.verifyToken(token);

    // Si le token est valide, renvoyer les informations décodées
    res.status(200).json({ message: 'Token valide', decoded });
  } catch (error) {
    console.error('Erreur lors de la vérification du token:', error);
    res.status(401).json({ message: 'Token invalide ou expiré' });
  }
};

module.exports = {
  signup,
  login,
  verifyToken
};