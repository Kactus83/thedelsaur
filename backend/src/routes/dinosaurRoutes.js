const express = require('express');
const dinosaurController = require('../controllers/dinosaurController');
const authenticateJWT = require('../middlewares/authMiddleware');

const router = express.Router();

// Route pour récupérer le dinosaure de l'utilisateur connecté (prévu pour utilisation future)
router.get('/my-dinosaur', authenticateJWT, dinosaurController.getMyDinosaur);

module.exports = router;
