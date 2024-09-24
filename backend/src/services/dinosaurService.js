const dinosaurModel = require('../models/dinosaurModel');

/**
 * Récupère tous les dinosaures.
 * @returns {Promise<Array>} Liste de dinosaures.
 */
const getAllDinosaurs = async () => {
  return await dinosaurModel.findAll();
};

/**
 * Récupère un dinosaure par son ID.
 * @param {number} dinosaurId - ID du dinosaure.
 * @returns {Promise<Object|null>} Le dinosaure ou null.
 */
const getDinosaurById = async (dinosaurId) => {
  return await dinosaurModel.findById(dinosaurId);
};

/**
 * Crée un nouveau dinosaure avec des valeurs par défaut.
 * @param {string} name - Nom du dinosaure.
 * @param {number} userId - ID de l'utilisateur propriétaire.
 * @param {string} diet - Régime alimentaire.
 * @param {number} [energy=10000] - Énergie initiale.
 * @param {number} [food=10000] - Nourriture initiale.
 * @param {number} [experience=0] - Expérience initiale.
 * @returns {Promise<number>} ID du dinosaure créé.
 */
const createDinosaur = async (name, userId, diet, energy = 10000, food = 10000, experience = 0) => {
  return await dinosaurModel.createDinosaur(name, userId, diet, energy, food, experience);
};

/**
 * Met à jour un dinosaure.
 * @param {number} dinosaurId - ID du dinosaure.
 * @param {Object} updates - Champs à mettre à jour.
 * @returns {Promise<boolean>} Vrai si mis à jour, sinon faux.
 */
const updateDinosaur = async (dinosaurId, updates) => {
  return await dinosaurModel.updateDinosaur(dinosaurId, updates);
};

/**
 * Supprime un dinosaure.
 * @param {number} dinosaurId - ID du dinosaure.
 * @returns {Promise<boolean>} Vrai si supprimé, sinon faux.
 */
const deleteDinosaur = async (dinosaurId) => {
  return await dinosaurModel.deleteDinosaur(dinosaurId);
};

module.exports = {
  getAllDinosaurs,
  getDinosaurById,
  createDinosaur,
  updateDinosaur,
  deleteDinosaur
};