const userService = require('../services/usersService');
const dinosaurService = require('../services/dinosaurService');

/**
 * Contrôleur pour récupérer tous les utilisateurs (Admin).
 * @param {Object} req - La requête Express.
 * @param {Object} res - La réponse Express.
 */
exports.getAllUsers = async (req, res) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Erreur dans getAllUsers:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Contrôleur pour récupérer un utilisateur par username (Admin).
 * @param {Object} req - La requête Express.
 * @param {Object} res - La réponse Express.
 */
exports.getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    const user = await userService.getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Erreur dans getUserByUsername:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Contrôleur pour récupérer un utilisateur par email (Admin).
 * @param {Object} req - La requête Express.
 * @param {Object} res - La réponse Express.
 */
exports.getUserByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const user = await userService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Erreur dans getUserByEmail:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Contrôleur pour récupérer un utilisateur par ID (Admin).
 * @param {Object} req - La requête Express.
 * @param {Object} res - La réponse Express.
 */
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Erreur dans getUserById:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Contrôleur pour supprimer un utilisateur par ID (Admin).
 * @param {Object} req - La requête Express.
 * @param {Object} res - La réponse Express.
 */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await userService.deleteUser(id);
    if (!result) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur dans deleteUser:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Contrôleur pour récupérer tous les dinosaures (Admin).
 * @param {Object} req - La requête Express.
 * @param {Object} res - La réponse Express.
 */
exports.getAllDinosaurs = async (req, res) => {
  try {
    const dinosaurs = await dinosaurService.getAllDinosaurs();
    res.status(200).json(dinosaurs);
  } catch (error) {
    console.error('Erreur dans getAllDinosaurs:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Contrôleur pour récupérer un dinosaure par ID (Admin).
 * @param {Object} req - La requête Express.
 * @param {Object} res - La réponse Express.
 */
exports.getDinosaurById = async (req, res) => {
  try {
    const { id } = req.params;
    const dinosaur = await dinosaurService.getDinosaurById(id);
    if (!dinosaur) {
      return res.status(404).json({ message: 'Dinosaure non trouvé' });
    }
    res.status(200).json(dinosaur);
  } catch (error) {
    console.error('Erreur dans getDinosaurById:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Contrôleur pour créer un dinosaure (Admin).
 * @param {Object} req - La requête Express.
 * @param {Object} res - La réponse Express.
 */
exports.createDinosaur = async (req, res) => {
  try {
    const { name, userId, diet, energy, food, experience, epoch } = req.body;

    // Validation des champs requis
    if (!name || !userId || !diet) {
      return res.status(400).json({ message: 'Nom, userId et régime alimentaire sont requis' });
    }

    const newDinosaurId = await dinosaurService.createDinosaur(name, userId, diet, energy, food, experience, epoch);
    const newDinosaur = await dinosaurService.getDinosaurById(newDinosaurId);

    res.status(201).json(newDinosaur);
  } catch (error) {
    console.error('Erreur dans createDinosaur:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Contrôleur pour mettre à jour un dinosaure (Admin).
 * @param {Object} req - La requête Express.
 * @param {Object} res - La réponse Express.
 */
exports.updateDinosaur = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const success = await dinosaurService.updateDinosaur(id, updates);
    if (!success) {
      return res.status(404).json({ message: 'Dinosaure non trouvé' });
    }

    const updatedDinosaur = await dinosaurService.getDinosaurById(id);
    res.status(200).json(updatedDinosaur);
  } catch (error) {
    console.error('Erreur dans updateDinosaur:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Contrôleur pour supprimer un dinosaure (Admin).
 * @param {Object} req - La requête Express.
 * @param {Object} res - La réponse Express.
 */
exports.deleteDinosaur = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await dinosaurService.deleteDinosaur(id);
    if (!success) {
      return res.status(404).json({ message: 'Dinosaure non trouvé' });
    }
    res.status(200).json({ message: 'Dinosaure supprimé avec succès' });
  } catch (error) {
    console.error('Erreur dans deleteDinosaur:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};