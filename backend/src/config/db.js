const mysql = require('mysql2');
require('dotenv').config(); // Charger les variables d'environnement

// Configuration de la connexion à la base de données
const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'mydatabase',
  waitForConnections: true,
  connectionLimit: 10, // Nombre maximum de connexions dans le pool
  queueLimit: 0 // Pas de limite pour les connexions en attente
};

// Créer un pool de connexions avec le support des promesses
const pool = mysql.createPool(dbConfig);

// Utiliser les promesses
const db = pool.promise();

module.exports = db;