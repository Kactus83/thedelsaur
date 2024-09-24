const db = require('../config/db');

/**
 * Récupère tous les dinosaures.
 * @returns {Promise<Array>} Une promesse résolvant en liste de dinosaures.
 */
const findAll = async () => {
  try {
    const [results] = await db.query('SELECT * FROM dinosaur');
    return results;
  } catch (err) {
    console.error('Erreur lors de la récupération des dinosaures:', err);
    throw err;
  }
};

/**
 * Récupère un dinosaure par son ID.
 * @param {number} dinosaurId - L'ID du dinosaure.
 * @returns {Promise<Object|null>} Une promesse résolvant en dinosaure ou null.
 */
const findById = async (dinosaurId) => {
  try {
    const [results] = await db.query('SELECT * FROM dinosaur WHERE id = ?', [dinosaurId]);
    return results.length > 0 ? results[0] : null;
  } catch (err) {
    console.error('Erreur lors de la récupération du dinosaure:', err);
    throw err;
  }
};

/**
 * Crée un nouveau dinosaure.
 * @param {string} name - Le nom du dinosaure.
 * @param {number} userId - L'ID de l'utilisateur propriétaire.
 * @param {string} diet - Le régime alimentaire du dinosaure.
 * @param {number} energy - L'énergie initiale du dinosaure.
 * @param {number} food - La nourriture initiale du dinosaure.
 * @param {number} experience - L'expérience initiale du dinosaure.
 * @returns {Promise<number>} Une promesse résolvant en ID du dinosaure créé.
 */
const createDinosaur = async (name, userId, diet, energy, food, experience) => {
  try {
    const query = `
      INSERT INTO dinosaur (name, user_id, diet, energy, food, experience)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(query, [name, userId, diet, energy, food, experience]);
    return result.insertId;
  } catch (err) {
    console.error('Erreur lors de la création du dinosaure:', err);
    throw err;
  }
};

/**
 * Met à jour un dinosaure.
 * @param {number} dinosaurId - L'ID du dinosaure à mettre à jour.
 * @param {Object} updates - Les champs à mettre à jour.
 * @returns {Promise<boolean>} Une promesse résolvant en vrai si mis à jour, sinon faux.
 */
const updateDinosaur = async (dinosaurId, updates) => {
  try {
    const fields = [];
    const values = [];

    for (const key in updates) {
      fields.push(`${key} = ?`);
      values.push(updates[key]);
    }

    const query = `UPDATE dinosaur SET ${fields.join(', ')} WHERE id = ?`;
    values.push(dinosaurId);

    const [result] = await db.query(query, values);
    return result.affectedRows > 0;
  } catch (err) {
    console.error('Erreur lors de la mise à jour du dinosaure:', err);
    throw err;
  }
};

/**
 * Supprime un dinosaure par son ID.
 * @param {number} dinosaurId - L'ID du dinosaure à supprimer.
 * @returns {Promise<boolean>} Une promesse résolvant en vrai si supprimé, sinon faux.
 */
const deleteDinosaur = async (dinosaurId) => {
  try {
    const [result] = await db.query('DELETE FROM dinosaur WHERE id = ?', [dinosaurId]);
    return result.affectedRows > 0;
  } catch (err) {
    console.error('Erreur lors de la suppression du dinosaure:', err);
    throw err;
  }
};

module.exports = {
  findAll,
  findById,
  createDinosaur,
  updateDinosaur,
  deleteDinosaur
};