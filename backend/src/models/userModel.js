const db = require('../config/db');

// Requête pour trouver un utilisateur par email
exports.findByEmail = async (email) => {
  try {
    const [results] = await db.query('SELECT * FROM user WHERE email = ?', [email]);
    return results.length > 0 ? results[0] : null;
  } catch (err) {
    console.error('Erreur lors de la recherche de l\'utilisateur par email:', err);
    throw err;
  }
};

// Requête pour créer un utilisateur
exports.createUser = async (username, email, passwordHash) => {
  try {
    const [result] = await db.query(
      'INSERT INTO user (username, email, password_hash) VALUES (?, ?, ?)',
      [username, email, passwordHash]
    );
    return result.insertId;
  } catch (err) {
    console.error('Erreur lors de la création de l\'utilisateur:', err);
    throw err;
  }
};
