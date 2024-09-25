const dinosaurService = require('../services/dinosaurService');

/**
 * Contrôleur pour récupérer le dinosaure de l'utilisateur connecté.
 */
exports.getMyDinosaur = async (req, res) => {
  try {
    const userId = req.user.id; // ID de l'utilisateur depuis le token JWT
    const dinosaur = await dinosaurService.getDinosaurByUserId(userId);
    if (!dinosaur) {
      return res.status(404).json({ message: 'Dinosaure non trouvé' });
    }
    res.status(200).json(dinosaur);
  } catch (error) {
    console.error('Erreur lors de la récupération du dinosaure:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};
