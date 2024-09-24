const dinosaurService = require('../services/dinosaurService');

// Contrôleur pour récupérer tous les dinosaures
exports.getAllDinosaurs = async (req, res) => {
  try {
    const dinosaurs = await dinosaurService.getAllDinosaurs();
    res.status(200).json(dinosaurs);
  } catch (error) {
    console.error('Erreur lors de la récupération des dinosaures:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// Contrôleur pour récupérer un dinosaure par son ID
exports.getDinosaurById = async (req, res) => {
  try {
    const dinosaurId = req.params.id;
    const dinosaur = await dinosaurService.getDinosaurById(dinosaurId);
    if (!dinosaur) {
      return res.status(404).json({ message: 'Dinosaure non trouvé' });
    }
    res.status(200).json(dinosaur);
  } catch (error) {
    console.error('Erreur lors de la récupération du dinosaure:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// Contrôleur pour créer un dinosaure
exports.createDinosaur = async (req, res) => {
  try {
    const { name, userId, diet } = req.body;

    // Validation des champs requis
    if (!name || !userId || !diet) {
      return res.status(400).json({ message: 'Nom, userId et régime alimentaire sont requis' });
    }

    const newDinosaurId = await dinosaurService.createDinosaur(name, userId, diet);
    const newDinosaur = await dinosaurService.getDinosaurById(newDinosaurId);

    res.status(201).json(newDinosaur);
  } catch (error) {
    console.error('Erreur lors de la création du dinosaure:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// Contrôleur pour mettre à jour un dinosaure
exports.updateDinosaur = async (req, res) => {
  try {
    const dinosaurId = req.params.id;
    const updates = req.body;

    const success = await dinosaurService.updateDinosaur(dinosaurId, updates);
    if (!success) {
      return res.status(404).json({ message: 'Dinosaure non trouvé' });
    }

    const updatedDinosaur = await dinosaurService.getDinosaurById(dinosaurId);
    res.status(200).json(updatedDinosaur);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du dinosaure:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// Contrôleur pour supprimer un dinosaure
exports.deleteDinosaur = async (req, res) => {
  try {
    const dinosaurId = req.params.id;
    const success = await dinosaurService.deleteDinosaur(dinosaurId);
    if (!success) {
      return res.status(404).json({ message: 'Dinosaure non trouvé' });
    }
    res.status(200).json({ message: 'Dinosaure supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du dinosaure:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};
