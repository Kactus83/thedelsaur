const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = process.env.PORT || 3000;

// Connexion à la base de données MariaDB
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'mydatabase'
});

// Vérifier la connexion à la base de données
db.connect((err) => {
  if (err) {
    console.error('Erreur de connexion à MariaDB:', err);
  } else {
    console.log('Connecté à MariaDB');
  }
});

// Route de base pour vérifier que le serveur fonctionne
app.get('/', (req, res) => {
  res.send('Dinosaur Tamagotchi API is running');
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
