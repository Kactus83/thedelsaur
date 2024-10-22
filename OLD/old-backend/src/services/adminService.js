const adminRepository = require('../models/adminModel');

// Récupère tous les utilisateurs
const getAllUsers = async () => {
  return await adminRepository.findAllUsers();
};

// Récupère un utilisateur par username
const getUserByUsername = async (username) => {
  return await adminRepository.findUserByUsername(username);
};

// Récupère un utilisateur par email
const getUserByEmail = async (email) => {
  return await adminRepository.findUserByEmail(email);
};

// Récupère un utilisateur par ID
const getUserById = async (id) => {
  return await adminRepository.findUserById(id);
};

// Supprime un utilisateur par ID
const deleteUser = async (id) => {
  return await adminRepository.deleteUserById(id);
};

// Récupère tous les dinosaures
const getAllDinosaurs = async () => {
  return await adminRepository.findAllDinosaurs();
};

// Récupère un dinosaure par ID
const getDinosaurById = async (id) => {
  return await adminRepository.findDinosaurById(id);
};

// Crée un dinosaure
const createDinosaur = async (name, userId, diet, energy = 10000, food = 10000, experience = 0, epoch = 'past') => {
  return await adminRepository.createDinosaur(name, userId, diet, energy, food, experience, epoch);
};

// Met à jour un dinosaure
const updateDinosaur = async (id, updates) => {
  return await adminRepository.updateDinosaurById(id, updates);
};

// Supprime un dinosaure par ID
const deleteDinosaur = async (id) => {
  return await adminRepository.deleteDinosaurById(id);
};

module.exports = {
  getAllUsers,
  getUserByUsername,
  getUserByEmail,
  getUserById,
  deleteUser,
  getAllDinosaurs,
  getDinosaurById,
  createDinosaur,
  updateDinosaur,
  deleteDinosaur,
};
