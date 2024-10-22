const jwt = require('jsonwebtoken');
require('dotenv').config();
const { getUserById } = require('../services/usersService'); 

/**
 * Middleware pour vérifier l'authentification JWT et la présence de l'utilisateur dans la base de données.
 * Si le token est valide et que l'utilisateur existe, ajoute l'utilisateur à req.user.
 */
const authenticateJWT = async (req, res, next) => {
  // Récupérer le token depuis le header Authorization
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Extraire le token
    const token = authHeader.slice(7, authHeader.length);

    try {
      // Vérifier et décoder le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Récupérer l'utilisateur depuis la base de données
      const user = await getUserById(decoded.id); // Supposons que le token contienne l'ID utilisateur sous "id"

      if (!user) {
        return res.status(401).json({ message: 'Utilisateur non trouvé' });
      }

      // Ajouter l'utilisateur à req.user
      req.user = user;
      console.log('Utilisateur authentifié:', user);

      // Passer à l'étape suivante
      next();
    } catch (err) {
      console.error('Erreur lors de la vérification du token ou de la récupération de l\'utilisateur:', err);
      return res.status(401).json({ message: 'Token invalide ou utilisateur non trouvé' });
    }
  } else {
    // Si aucun token n'est fourni
    res.status(401).json({ message: 'Token manquant' });
  }
};

module.exports = authenticateJWT;
