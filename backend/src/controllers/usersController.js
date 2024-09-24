const usersService = require('../services/usersService');

// Contrôleur pour récupérer tous les utilisateurs
exports.getAllUsers = async (req, res) => {
  try {
    const users = await usersService.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// Contrôleur pour récupérer un utilisateur par son ID
exports.getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await usersService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// Contrôleur pour récupérer un utilisateur par email
exports.getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await usersService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur par email:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// Contrôleur pour récupérer un utilisateur par username
exports.getUserByUsername = async (req, res) => {
  try {
    const username = req.params.username;
    const user = await usersService.getUserByUsername(username);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'utilisateur par username:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

// Contrôleur pour supprimer un utilisateur par son ID
exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await usersService.deleteUser(userId);
    if (!result) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};

/**
 * Contrôleur pour récupérer le profil de l'utilisateur connecté.
 */
exports.getMyProfile = async (req, res) => {
  try {
    const userId = req.user.id; // ID de l'utilisateur depuis le token JWT
    const user = await usersService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Erreur lors de la récupération du profil utilisateur:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
};
