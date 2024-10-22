const usersService = require('../services/usersService');


/**
 * Contrôleur pour récupérer le profil de l'utilisateur connecté.
 */
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ID de l'utilisateur depuis le token JWT
    console.log('ID de l\'utilisateur connecté:', userId);
    let user = await usersService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé pour l id', userId });
    }
    user.password_hash = "";
    res.status(200).json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil utilisateur:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};
