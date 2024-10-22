/**
 * Middleware pour vérifier si l'utilisateur est un administrateur.
 * Si l'utilisateur n'est pas admin, une réponse 403 est renvoyée.
 */
const authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
      // Si l'utilisateur est admin, passer au middleware ou contrôleur suivant
      next();
    } else {
      // Sinon, renvoyer une erreur 403 (Forbidden)
      return res.status(403).json({ message: 'Accès interdit : administrateurs uniquement.' });
    }
  };
  
  module.exports = authorizeAdmin;
  