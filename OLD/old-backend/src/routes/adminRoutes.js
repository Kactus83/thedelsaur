const express = require('express');
const adminController = require('../controllers/adminController');
const authenticateJWT = require('../middlewares/authMiddleware'); 
const authorizeAdmin = require('../middlewares/authorizeAdmin'); 
const router = express.Router();

// Routes pour la gestion des utilisateurs
router.get('/users', authenticateJWT, authorizeAdmin, adminController.getAllUsers);
router.get('/users/username/:username', authenticateJWT, authorizeAdmin, adminController.getUserByUsername);
router.get('/users/email/:email', authenticateJWT, authorizeAdmin, adminController.getUserByEmail);
router.get('/users/:id', authenticateJWT, authorizeAdmin, adminController.getUserById);
router.delete('/users/:id', authenticateJWT, authorizeAdmin, adminController.deleteUser);

// Routes pour la gestion des dinosaures
router.get('/dinosaurs', authenticateJWT, authorizeAdmin, adminController.getAllDinosaurs);
router.get('/dinosaurs/:id', authenticateJWT, authorizeAdmin, adminController.getDinosaurById);
router.post('/dinosaurs', authenticateJWT, authorizeAdmin, adminController.createDinosaur);
router.put('/dinosaurs/:id', authenticateJWT, authorizeAdmin, adminController.updateDinosaur);
router.delete('/dinosaurs/:id', authenticateJWT, authorizeAdmin, adminController.deleteDinosaur);

module.exports = router;
