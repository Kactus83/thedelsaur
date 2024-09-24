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

// Modèle pour récupérer un dinosaure par userId
exports.findByUserId = async (userId) => {
  try {
    const [results] = await db.query('SELECT * FROM dinosaur WHERE user_id = ?', [userId]);
    return results.length > 0 ? results[0] : null;
  } catch (err) {
    console.error('Erreur lors de la récupération du dinosaure par userId:', err);
    throw err;
  }
};

// Modèle pour créer un dinosaure
exports.createDinosaur = async (name, userId, diet, energy = 10000, food = 10000, experience = 0, epoch = 'past') => {
  try {
    const query = 'INSERT INTO dinosaur (name, user_id, diet, energy, food, experience, epoch) VALUES (?, ?, ?, ?, ?, ?, ?)';
    console.log('Executing query:', query);
    console.log('With values:', [name, userId, diet, energy, food, experience, epoch]);

    const [result] = await db.query(query, [name, userId, diet, energy, food, experience, epoch]);
    console.log('Dinosaur created with ID:', result.insertId);
    return result.insertId; // Renvoie l'ID du dinosaure créé
  } catch (err) {
    console.error('Erreur lors de la création du dinosaure:', err);
    throw err;
  }
};

// Modèle pour mettre à jour un dinosaure
exports.updateDinosaur = async (dinosaurId, updates) => {
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

// Modèle pour supprimer un dinosaure
exports.deleteDinosaur = async (dinosaurId) => {
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