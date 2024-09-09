const db = require('../config/db');

// Requête pour trouver un utilisateur par email
exports.findByEmail = (email) => {
  return new Promise((resolve, reject) => {
    const query = 'SELECT * FROM user WHERE email = ?';
    db.query(query, [email], (err, results) => {
      if (err) {
        console.error('Erreur lors de la recherche de l\'utilisateur par email:', err);
        return reject(err); // Rejette la promesse en cas d'erreur
      }
      if (results.length > 0) {
        resolve(results[0]); // Renvoie l'utilisateur trouvé
      } else {
        resolve(null); // Renvoie null si aucun utilisateur trouvé
      }
    });
  });
};

// Requête pour créer un utilisateur
exports.createUser = (username, email, passwordHash) => {
  return new Promise((resolve, reject) => {
    const query = 'INSERT INTO user (username, email, password_hash) VALUES (?, ?, ?)';
    db.query(query, [username, email, passwordHash], (err, result) => {
      if (err) {
        console.error('Erreur lors de la création de l\'utilisateur:', err);
        return reject(err); // Rejette la promesse en cas d'erreur
      }
      resolve(result.insertId); // Renvoie l'ID de l'utilisateur créé
    });
  });
};
