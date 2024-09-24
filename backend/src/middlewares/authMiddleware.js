const jwt = require('jsonwebtoken');
require('dotenv').config();

/**
 * Middleware pour vérifier l'authentification JWT.
 * Si le token est valide, ajoute l'utilisateur à req.user.
 */
const authenticateJWT = (req, res, next) => {
  // Récupérer le token depuis le header Authorization
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Extraire le token
    const token = authHeader.slice(7, authHeader.length);

    // Vérifier le token
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.error('Token JWT invalide:', err);
        return res.status(401).json({ message: 'Token invalide' });
      }

      // Ajouter les informations de l'utilisateur à la requête
      req.user = user;
      next();
    });
  } else {
    // Si aucun token n'est fourni
    res.status(401).json({ message: 'Token manquant' });
  }
};

module.exports = authenticateJWT;