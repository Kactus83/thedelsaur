const userModel = require('../models/userModel');
const axios = require('axios');
// Service pour récupérer tous les utilisateurs userModel.findAll
exports.getAllUsers = async () => {
  return await axios.get();
};

// Service pour récupérer un utilisateur par son ID userModel.findById
exports.getUserById = async (userId) => {
  return await axios.get(userId);
};

// Service pour récupérer un utilisateur par email userModel.findByEmail(email)
exports.getUserByEmail = async (email) => {
  return await axios.get(email);
};

// Service pour récupérer un utilisateur par username userModel.findByUsername(username)
exports.getUserByUsername = async (username) => {
  return await axios.get(username);
};

// Service pour supprimer un utilisateur par son ID userModel.findById(userId)
exports.deleteUser = async (userId) => {
  const user = await axios.get(userId);
  if (!user) {
    return null;
  }
  return await userModel.deleteUser(userId);
};
