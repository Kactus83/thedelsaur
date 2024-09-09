const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

const dbConfig = {
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'mydatabase'
};

let db;
const maxRetries = 10; // Nombre maximal de tentatives de connexion
let retries = 0;

function connectWithRetry() {
  db = mysql.createConnection(dbConfig);

  db.connect((err) => {
    if (err) {
      retries++;
      if (retries <= maxRetries) {
        console.error(`Erreur de connexion à MariaDB (tentative ${retries}/${maxRetries}):`, err);
        setTimeout(connectWithRetry, 5000); // Réessayer après 5 secondes
      } else {
        console.error('Impossible de se connecter à MariaDB après plusieurs tentatives.');
        process.exit(1); // Sortir du processus si la connexion échoue trop de fois
      }
    } else {
      console.log('Connecté à MariaDB');
      startServer();
    }
  });
}

// Route de base pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.send('Dinosaur Tamagotchi API is running');
});

// Démarrer le serveur Express uniquement après la connexion réussie à MariaDB
function startServer() {
  app.listen(port, () => {
    console.log(`Backend server is running on http://localhost:${port}`);
  });
}

// Lancer la connexion avec retry
connectWithRetry();
