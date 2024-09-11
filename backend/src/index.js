const express = require('express');
const cors = require('cors'); 
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const usersRoutes = require('./routes/usersRoutes');

const app = express();
const port = process.env.PORT || 3000;

// Utiliser CORS pour autoriser les requêtes cross-origin
app.use(cors());

// Pour pouvoir traiter les requêtes JSON
app.use(express.json()); 

// Routes d'authentification
app.use('/auth', authRoutes);

// Routes admin
app.use('/admin', adminRoutes);

// Route Users Management
app.use('/users', usersRoutes);

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});