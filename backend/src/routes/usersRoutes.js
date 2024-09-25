const express = require('express');
const usersController = require('../controllers/usersController');
const authenticateJWT = require('../middlewares/authMiddleware');

const router = express.Router();

// Route pour récupérer le profil de l'utilisateur connecté
router.get('/my-profile', authenticateJWT, usersController.getMyProfile);

module.exports = router;
