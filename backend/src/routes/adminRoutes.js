const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

// Routes pour la gestion des utilisateurs

// Récupérer tous les utilisateurs
router.get('/users', adminController.getAllUsers);

// Récupérer un utilisateur par username
router.get('/users/username/:username', adminController.getUserByUsername);

// Récupérer un utilisateur par email
router.get('/users/email/:email', adminController.getUserByEmail);

// Récupérer un utilisateur par ID
router.get('/users/:id', adminController.getUserById);

// Supprimer un utilisateur par ID
router.delete('/users/:id', adminController.deleteUser);

// Routes pour la gestion des dinosaures

// Récupérer tous les dinosaures
router.get('/dinosaurs', adminController.getAllDinosaurs);

// Récupérer un dinosaure par ID
router.get('/dinosaurs/:id', adminController.getDinosaurById);

// Créer un dinosaure
router.post('/dinosaurs', adminController.createDinosaur);

// Mettre à jour un dinosaure
router.put('/dinosaurs/:id', adminController.updateDinosaur);

// Supprimer un dinosaure
router.delete('/dinosaurs/:id', adminController.deleteDinosaur);

module.exports = router;
