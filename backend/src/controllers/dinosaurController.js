const dinosaurService = require('../services/dinosaurService');
const dinosaurTimeService = require('../services/dinosaurTimeService'); // Nouveau service

/**
 * Contrôleur pour récupérer le dinosaure de l'utilisateur connecté.
 */
exports.getMyDinosaur = async (req, res) => {
  try {
    const userId = req.user.id; // ID de l'utilisateur depuis le token JWT
    let dinosaur = await dinosaurService.getDinosaurByUserId(userId);

    if (!dinosaur) {
      return res.status(404).json({ message: 'Dinosaure non trouvé' });
    }

    // Appel du service d'ajustement des statistiques en fonction du temps
    dinosaur = dinosaurTimeService.adjustDinosaurStats(dinosaur);

    // Sauvegarder les nouvelles valeurs du dinosaure après ajustement
    await dinosaurService.updateDinosaur(dinosaur.id, {
      food: dinosaur.food,
      energy: dinosaur.energy,
      last_update_by_time_service: dinosaur.last_update_by_time_service,
    });

    // Renvoyer le dinosaure ajusté
    res.status(200).json(dinosaur);
  } catch (error) {
    console.error('Erreur lors de la récupération du dinosaure:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};
