const db = require('../config/db');

/**
 * Récupère un dinosaure par son ID.
 * @param {number} dinosaurId - L'ID du dinosaure à récupérer.
 * @returns {Promise<Object|null>} Le dinosaure correspondant ou null s'il n'existe pas.
 */
const getDinosaurById = async (dinosaurId) => {
  try {
    const [results] = await db.query('SELECT * FROM dinosaur WHERE id = ?', [dinosaurId]);
    return results.length > 0 ? results[0] : null;
  } catch (err) {
    console.error('Erreur lors de la récupération du dinosaure:', err);
    throw err;
  }
};

/**
 * Récupère le dinosaure associé à un utilisateur par son userId.
 * @param {number} userId - L'ID de l'utilisateur.
 * @returns {Promise<Object|null>} Le dinosaure correspondant ou null.
 */
const getDinosaurByUserId = async (userId) => {
  try {
    const [results] = await db.query('SELECT * FROM dinosaur WHERE user_id = ?', [userId]);
    return results.length > 0 ? results[0] : null;
  } catch (err) {
    console.error('Erreur lors de la récupération du dinosaure par userId:', err);
    throw err;
  }
};

/**
 * Met à jour un dinosaure, y compris `max_food` et `max_energy`.
 * @param {number} dinosaurId - L'ID du dinosaure à mettre à jour.
 * @param {Object} updates - Les champs à mettre à jour.
 * @returns {Promise<boolean>} Vrai si mis à jour, sinon faux.
 */
const updateDinosaur = async (dinosaurId, updates) => {
  try {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    const query = `UPDATE dinosaur SET ${fields} WHERE id = ?`;
    values.push(dinosaurId);

    console.log('Executing query:', query);
    console.log('With values:', values);

    const [result] = await db.query(query, values);
    return result.affectedRows > 0;
  } catch (err) {
    console.error('Erreur lors de la mise à jour du dinosaure:', err);
    throw err;
  }
};

/**
 * Crée un nouveau dinosaure, en incluant `max_food` et `max_energy`.
 * @param {string} name - Nom du dinosaure.
 * @param {number} userId - L'ID de l'utilisateur propriétaire.
 * @param {string} diet - Régime alimentaire.
 * @param {number} [energy=10000] - Énergie initiale.
 * @param {number} [food=10000] - Nourriture initiale.
 * @param {number} [max_energy=10000] - Maximum d'énergie.
 * @param {number} [max_food=10000] - Maximum de nourriture.
 * @param {number} [experience=0] - Expérience initiale.
 * @param {string} [epoch='past'] - Époque du dinosaure.
 * @returns {Promise<number>} L'ID du dinosaure créé.
 */
const createDinosaur = async (name, userId, diet, energy = 10000, food = 10000, max_energy = 10000, max_food = 10000, experience = 0, epoch = 'past') => {
  try {
    const query = 'INSERT INTO dinosaur (name, user_id, diet, energy, food, max_energy, max_food, experience, epoch) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    console.log('Executing query:', query);
    console.log('With values:', [name, userId, diet, energy, food, max_energy, max_food, experience, epoch]);

    const [result] = await db.query(query, [name, userId, diet, energy, food, max_energy, max_food, experience, epoch]);
    console.log('Dinosaur created with ID:', result.insertId);
    return result.insertId; // Renvoie l'ID du dinosaure créé
  } catch (err) {
    console.error('Erreur lors de la création du dinosaure:', err);
    throw err;
  }
};

/**
 * Supprime un dinosaure par son ID.
 * @param {number} dinosaurId - L'ID du dinosaure à supprimer.
 * @returns {Promise<boolean>} Vrai si supprimé, sinon faux.
 */
const deleteDinosaurById = async (dinosaurId) => {
  try {
    const query = 'DELETE FROM dinosaur WHERE id = ?';
    console.log('Executing query:', query);
    console.log('With values:', [dinosaurId]);

    const [result] = await db.query(query, [dinosaurId]);
    return result.affectedRows > 0;
  } catch (err) {
    console.error('Erreur lors de la suppression du dinosaure:', err);
    throw err;
  }
};

module.exports = {
  getDinosaurById,
  getDinosaurByUserId,
  updateDinosaur,
  createDinosaur,
  deleteDinosaurById,
};
