const db = require('../config/db');

// Modèle pour récupérer tous les utilisateurs
exports.findAll = async () => {
  try {
    const [results] = await db.query('SELECT * FROM user');
    return results;
  } catch (err) {
    console.error('Erreur lors de la récupération des utilisateurs:', err);
    throw err;
  }
};

// Modèle pour récupérer un utilisateur par son ID
exports.findById = async (userId) => {
  try {
    const [results] = await db.query('SELECT * FROM user WHERE id = ?', [userId]);
    return results.length > 0 ? results[0] : null;
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'utilisateur:', err);
    throw err;
  }
};

// Modèle pour récupérer un utilisateur par email
exports.findByEmail = async (email) => {
  try {
    const [results] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
    return results.length > 0 ? results[0] : null;
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'utilisateur par email:', err);
    throw err;
  }
};

// Modèle pour récupérer un utilisateur par username
exports.findByUsername = async (username) => {
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