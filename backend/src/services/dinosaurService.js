const dinosaurModel = require('../models/dinosaurModel');

/**
 * Récupère un dinosaure par son ID.
 */
const getDinosaurById = async (dinosaurId) => {
  return await dinosaurModel.findById(dinosaurId);
};

/**
 * Récupère le dinosaure associé à un utilisateur par son userId.
 * @param {number} userId - ID de l'utilisateur.
 * @returns {Promise<Object|null>} Le dinosaure ou null.
 */
const getDinosaurByUserId = async (userId) => {
  return await dinosaurModel.findByUserId(userId);
};

/**
 * Met à jour un dinosaure.
 */
const updateDinosaur = async (dinosaurId, updates) => {
  // Met à jour le dinosaure dans la base de données, y compris le champ `last_update_by_time_service`
  return await dinosaurModel.updateDinosaur(dinosaurId, updates);
};

module.exports = {
  getDinosaurById,
  updateDinosaur,
  getDinosaurByUserId,
};
