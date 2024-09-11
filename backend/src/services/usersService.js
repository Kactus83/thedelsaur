const userModel = require('../models/userModel');

// Service pour récupérer tous les utilisateurs
exports.getAllUsers = async () => {
  return await userModel.findAll();
};

// Service pour récupérer un utilisateur par son ID
exports.getUserById = async (userId) => {
  return await userModel.findById(userId);
};

// Service pour récupérer un utilisateur par email
exports.getUserByEmail = async (email) => {
  return await userModel.findByEmail(email);
};

// Service pour récupérer un utilisateur par username
exports.getUserByUsername = async (username) => {
  return await userModel.findByUsername(username);
};

// Service pour supprimer un utilisateur par son ID
exports.deleteUser = async (userId) => {
  const user = await userModel.findById(userId);
  if (!user) {
    return null;
  }
  return await userModel.deleteUser(userId);
};
