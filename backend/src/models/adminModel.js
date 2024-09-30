const db = require('../config/db');

// Modèle pour récupérer tous les utilisateurs
exports.findAllUsers = async () => {
  try {
    const [results] = await db.query('SELECT * FROM user');
    return results;
  } catch (err) {
    console.error('Erreur lors de la récupération des utilisateurs:', err);
    throw err;
  }
};

// Modèle pour récupérer un utilisateur par son ID
exports.findUserById = async (userId) => {
  try {
    const [results] = await db.query('SELECT * FROM user WHERE id = ?', [userId]);
    return results.length > 0 ? results[0] : null;
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', err);
    throw err;
  }
};

// Modèle pour récupérer un utilisateur par email
exports.findUserByEmail = async (email) => {
  try {
    const [results] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
    return results.length > 0 ? results[0] : null;
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'utilisateur par email:', err);
    throw err;
  }
};

// Modèle pour récupérer un utilisateur par username
exports.findUserByUsername = async (username) => {
  try {
    const [results] = await db.query('SELECT * FROM user WHERE username = ?', [username]);
    return results.length > 0 ? results[0] : null;
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'utilisateur par username:', err);
    throw err;
  }
};

// Modèle pour supprimer un utilisateur par son ID
exports.deleteUser = async (userId) => {
  try {
    const [result] = await db.query('DELETE FROM user WHERE id = ?', [userId]);
    return result.affectedRows > 0;
  } catch (err) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', err);
    throw err;
  }
};

// Requête pour créer un utilisateur
exports.createUser = async (username, email, passwordHash) => {
  try {
    const query = 'INSERT INTO user (username, email, password_hash) VALUES (?, ?, ?)';
    console.log('Executing query:', query);
    console.log('With values:', [username, email, passwordHash]);

    const [result] = await db.query(query, [username, email, passwordHash]);
    console.log('User created with ID:', result.insertId);
    return result.insertId; // Renvoie l'ID de l'utilisateur créé
  } catch (err) {
    console.error('Erreur lors de la création de l\'utilisateur:', err);
    throw err;
  }
};

// -------- FONCTIONS RELATIVES AUX DINOSAURES -------- //

// Modèle pour récupérer tous les dinosaures
exports.findAllDinosaurs = async () => {
  try {
    const [results] = await db.query('SELECT * FROM dinosaur');
    return results;
  } catch (err) {
    console.error('Erreur lors de la récupération des dinosaures:', err);
    throw err;
  }
};

// Modèle pour récupérer un dinosaure par son ID
exports.findDinosaurById = async (dinosaurId) => {
  try {
    const [results] = await db.query('SELECT * FROM dinosaur WHERE id = ?', [dinosaurId]);
    return results.length > 0 ? results[0] : null;
  } catch (err) {
    console.error('Erreur lors de la récupération du dinosaure par ID:', err);
    throw err;
  }
};

// Modèle pour supprimer un dinosaure par son ID
exports.deleteDinosaurById = async (dinosaurId) => {
  try {
    const [result] = await db.query('DELETE FROM dinosaur WHERE id = ?', [dinosaurId]);
    return result.affectedRows > 0;
  } catch (err) {
    console.error('Erreur lors de la suppression du dinosaure:', err);
    throw err;
  }
};

// Modèle pour créer un dinosaure
exports.createDinosaur = async (name, userId, diet, energy = 10000, food = 10000, experience = 0, epoch = 'past') => {
  try {
    const query = 'INSERT INTO dinosaur (name, user_id, diet, energy, food, experience, epoch) VALUES (?, ?, ?, ?, ?, ?, ?)';
    const [result] = await db.query(query, [name, userId, diet, energy, food, experience, epoch]);
    return result.insertId; // Renvoie l'ID du dinosaure créé
  } catch (err) {
    console.error('Erreur lors de la création du dinosaure:', err);
    throw err;
  }
};

// Modèle pour mettre à jour un dinosaure par son ID
exports.updateDinosaurById = async (dinosaurId, updates) => {
  try {
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates);
    const query = `UPDATE dinosaur SET ${fields} WHERE id = ?`;
    values.push(dinosaurId);

    const [result] = await db.query(query, values);
    return result.affectedRows > 0;
  } catch (err) {
    console.error('Erreur lors de la mise à jour du dinosaure:', err);
    throw err;
  }
};
