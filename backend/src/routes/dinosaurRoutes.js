const express = require('express');
const dinosaurController = require('../controllers/dinosaurController');
const authenticateJWT = require('../middlewares/authMiddleware');

const router = express.Router();

// Route pour récupérer le dinosaure de l'utilisateur connecté (prévu pour utilisation future)
router.get('/my-dinosaur', authenticateJWT, dinosaurController.getMyDinosaur);

// Actions
router.post('/actions/eat', authenticateJWT, dinosaurController.eatDinosaur);
router.post('/actions/sleep', authenticateJWT, dinosaurController.sleepDinosaur);
router.post('/actions/wake', authenticateJWT, dinosaurController.wakeDinosaur);
router.post('/actions/resurrect', authenticateJWT, dinosaurController.resurrectDinosaur);


module.exports = router;
