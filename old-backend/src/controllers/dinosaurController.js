const dinosaurService = require('../services/dinosaurService');
const dinosaurTimeService = require('../services/dinosaurTimeService');
const dinosaurActionService = require('../services/dinosaurActionService');

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
      isDead: dinosaur.isDead,
      isSleeping: dinosaur.isSleeping,
    });

    // Renvoyer le dinosaure ajusté
    res.status(200).json(dinosaur);
  } catch (error) {
    console.error('Erreur lors de la récupération du dinosaure:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Contrôleur pour que le dinosaure mange.
 */
exports.eatDinosaur = async (req, res) => {
  try {
    const userId = req.user.id;
    let dinosaur = await dinosaurService.getDinosaurByUserId(userId);

    if (!dinosaur) {
      return res.status(404).json({ message: 'Dinosaure non trouvé' });
    }

    // Effectuer l'action de manger
    dinosaur = dinosaurActionService.eatDinosaur(dinosaur);

    // Appel du service d'ajustement des statistiques en fonction du temps
    dinosaur = dinosaurTimeService.adjustDinosaurStats(dinosaur);

    // Sauvegarder les nouvelles valeurs du dinosaure après ajustement
    await dinosaurService.updateDinosaur(dinosaur.id, {
      food: dinosaur.food,
      energy: dinosaur.energy,
      last_update_by_time_service: dinosaur.last_update_by_time_service,
      isDead: dinosaur.isDead,
      isSleeping: dinosaur.isSleeping,
    });

    res.status(200).json({ message: 'Action réussie', dinosaur });
  } catch (error) {
    console.error('Erreur lors de l\'action manger du dinosaure:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Contrôleur pour que le dinosaure se mette en sommeil.
 */
exports.sleepDinosaur = async (req, res) => {
  try {
    const userId = req.user.id;
    let dinosaur = await dinosaurService.getDinosaurByUserId(userId);

    if (!dinosaur) {
      return res.status(404).json({ message: 'Dinosaure non trouvé' });
    }

    // Effectuer l'action de dormir
    dinosaur = dinosaurActionService.sleepDinosaur(dinosaur);

    // Appel du service d'ajustement des statistiques en fonction du temps
    dinosaur = dinosaurTimeService.adjustDinosaurStats(dinosaur);

    // Sauvegarder les nouvelles valeurs du dinosaure après ajustement
    await dinosaurService.updateDinosaur(dinosaur.id, {
      food: dinosaur.food,
      energy: dinosaur.energy,
      last_update_by_time_service: dinosaur.last_update_by_time_service,
      isDead: dinosaur.isDead,
      isSleeping: dinosaur.isSleeping,
    });

    res.status(200).json({ message: 'Le dinosaure est maintenant en sommeil.', dinosaur });
  } catch (error) {
    console.error('Erreur lors de l\'action dormir du dinosaure:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Contrôleur pour que le dinosaure se réveille.
 */
exports.wakeDinosaur = async (req, res) => {
  try {
    const userId = req.user.id;
    let dinosaur = await dinosaurService.getDinosaurByUserId(userId);

    if (!dinosaur) {
      return res.status(404).json({ message: 'Dinosaure non trouvé' });
    }

    // Effectuer l'action de se réveiller
    dinosaur = dinosaurActionService.wakeDinosaur(dinosaur);

    // Appel du service d'ajustement des statistiques en fonction du temps
    dinosaur = dinosaurTimeService.adjustDinosaurStats(dinosaur);

    // Sauvegarder les nouvelles valeurs du dinosaure après ajustement
    await dinosaurService.updateDinosaur(dinosaur.id, {
      food: dinosaur.food,
      energy: dinosaur.energy,
      last_update_by_time_service: dinosaur.last_update_by_time_service,
      isDead: dinosaur.isDead,
      isSleeping: dinosaur.isSleeping,
    });

    res.status(200).json({ message: 'Le dinosaure s\'est réveillé.', dinosaur });
  } catch (error) {
    console.error('Erreur lors de l\'action réveiller du dinosaure:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Contrôleur pour ressusciter le dinosaure.
 */
exports.resurrectDinosaur = async (req, res) => {
  try {
    const userId = req.user.id;
    let dinosaur = await dinosaurService.getDinosaurByUserId(userId);

    if (!dinosaur) {
      return res.status(404).json({ message: 'Dinosaure non trouvé' });
    }

    if (!dinosaur.isDead) {
      return res.status(400).json({ message: 'Le dinosaure n\'est pas mort.' });
    }

    // Effectuer l'action de ressusciter
    dinosaur = dinosaurActionService.resurrectDinosaur(dinosaur);

    // Appel du service d'ajustement des statistiques en fonction du temps
    dinosaur = dinosaurTimeService.adjustDinosaurStats(dinosaur);

    // Sauvegarder les nouvelles valeurs du dinosaure après ajustement
    await dinosaurService.updateDinosaur(dinosaur.id, {
      food: dinosaur.food,
      energy: dinosaur.energy,
      last_update_by_time_service: dinosaur.last_update_by_time_service,
      isDead: dinosaur.isDead,
      isSleeping: dinosaur.isSleeping,
    });

    res.status(200).json({ message: 'Le dinosaure a été ressuscité.', dinosaur });
  } catch (error) {
    console.error('Erreur lors de l\'action ressusciter du dinosaure:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};