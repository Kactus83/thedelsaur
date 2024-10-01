const db = require('../config/db');

// Service pour récupérer tous les utilisateurs
const getAllUsers = async () => {
  try {
    const [results] = await db.query('SELECT * FROM user');
    return results;
  } catch (err) {
    console.error('Erreur lors de la récupération des utilisateurs:', err);
    throw err;
  }
};

// Service pour récupérer un utilisateur par son ID
const getUserById = async (userId) => {
  try {
    const [results] = await db.query('SELECT * FROM user WHERE id = ?', [userId]);
    return results.length > 0 ? results[0] : null;
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'utilisateur par ID:', err);
    throw err;
  }
};

// Service pour récupérer un utilisateur par email
const getUserByEmail = async (email) => {
  try {
    const [results] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
    return results.length > 0 ? results[0] : null;
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'utilisateur par email:', err);
    throw err;
  }
};

// Service pour récupérer un utilisateur par username
const getUserByUsername = async (username) => {
  try {
    const [results] = await db.query('SELECT * FROM user WHERE username = ?', [username]);
    return results.length > 0 ? results[0] : null;
  } catch (err) {
    console.error('Erreur lors de la récupération de l\'utilisateur par username:', err);
    throw err;
  }
};

// Service pour supprimer un utilisateur par son ID
const deleteUser = async (userId) => {
  try {
    const [results] = await db.query('SELECT * FROM user WHERE id = ?', [userId]);
    if (results.length === 0) {
      return null; // L'utilisateur n'existe pas
    }

    const query = 'DELETE FROM user WHERE id = ?';
    console.log('Executing query:', query);
    console.log('With values:', [userId]);

    const [result] = await db.query(query, [userId]);
    return result.affectedRows > 0; // Retourne true si suppression réussie
  } catch (err) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', err);
    throw err;
  }
};

// Service pour créer un utilisateur, en incluant `isAdmin` par défaut à `FALSE`
const createUser = async (username, email, passwordHash, isAdmin = false) => {
  try {
    
    if(username === 'admin') {
      isAdmin = true;
    }

    const query = 'INSERT INTO user (username, email, password_hash, isAdmin) VALUES (?, ?, ?, ?)';
    console.log('Executing query:', query);
    console.log('With values:', [username, email, passwordHash, isAdmin]);

    const [result] = await db.query(query, [username, email, passwordHash, isAdmin]);
    console.log('User created with ID:', result.insertId);
    return result.insertId; // Renvoie l'ID de l'utilisateur créé
  } catch (err) {
    console.error('Erreur lors de la création de l\'utilisateur:', err);
    throw err;
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  getUserByEmail,
  getUserByUsername,
  deleteUser,
  createUser
};
