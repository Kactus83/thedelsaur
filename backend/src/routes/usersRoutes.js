const express = require('express');
const usersController = require('../controllers/usersController');

const router = express.Router();

// Route pour récupérer tous les utilisateurs
router.get('/', usersController.getAllUsers);

// Route pour récupérer un utilisateur par son ID
router.get('/:id', usersController.getUserById);

// Route pour récupérer un utilisateur par son email
router.get('/email/:email', usersController.getUserByEmail);

// Route pour récupérer un utilisateur par son username
router.get('/username/:username', usersController.getUserByUsername);

// Route pour supprimer un utilisateur par son ID
router.delete('/:id', usersController.deleteUser);

module.exports = router;
