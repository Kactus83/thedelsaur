const mysql = require('mysql2');

// Charger les variables d'environnement
require('dotenv').config();

// Configuration de la connexion à la base de données
const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'mydatabase'
};

// Variable globale pour stocker la connexion
let db;

// Fonction de connexion à la base de données avec reconnexion
function connectWithRetry() {
    db = mysql.createConnection(dbConfig);

    db.connect((err) => {
        if (err) {
            console.error('Erreur de connexion à MariaDB:', err);
            console.log('Tentative de reconnexion dans 5 secondes...');
            setTimeout(connectWithRetry, 5000); // Réessayer après 5 secondes
        } else {
            console.log('Connecté à MariaDB');
        }
    });
}

// Appel initial de la fonction de connexion
connectWithRetry();

// Exporter la connexion
module.exports = db;
