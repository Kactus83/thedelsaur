const db = require('../config/db');

// Modèle pour récupérer tous les dinosaures
exports.findAll = async () => {
  try {
    const [results] = await db.query('SELECT * FROM dinosaur');
    return results;
  } catch (err) {
    console.error('Erreur lors de la récupération des dinosaures:', err);
    throw err;
  }
};

// Modèle pour récupérer un dinosaure par son ID
exports.findById = async (dinosaurId) => {
  try {
    const [results] = await db.query('SELECT * FROM dinosaur WHERE id = ?', [dinosaurId]);
    return results.length > 0 ? results[0] : null;
  } catch (err) {
    console.error('Erreur lors de la récupération du dinosaure:', err);
    throw err;
  }
};

// Modèle pour créer un dinosaure
exports.createDinosaur = async (name, userId, diet) => {
  try {
    const query = 'INSERT INTO dinosaur (name, user_id, diet) VALUES (?, ?, ?)';
    const [result] = await db.query(query, [name, userId, diet]);
    return result.insertId;
  } catch (err) {
    console.error('Erreur lors de la création du dinosaure:', err);
    throw err;
  }
};

// Modèle pour mettre à jour un dinosaure
exports.updateDinosaur = async (dinosaurId, updates) => {
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

// Modèle pour supprimer un dinosaure par son ID
exports.deleteDinosaur = async (dinosaurId) => {
  try {
    const [result] = await db.query('DELETE FROM dinosaur WHERE id = ?', [dinosaurId]);
    return result.affectedRows > 0;
  } catch (err) {
    console.error('Erreur lors de la suppression du dinosaure:', err);
    throw err;
  }
};
