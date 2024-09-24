const express = require('express');
const dinosaurController = require('../controllers/dinosaurController');
const authenticateJWT = require('../middlewares/authMiddleware');

const router = express.Router();

// Route pour récupérer tous les dinosaures
router.get('/', dinosaurController.getAllDinosaurs);

// Route pour récupérer le dinosaure de l'utilisateur connecté
router.get('/my-dinosaur', authenticateJWT, dinosaurController.getMyDinosaur);

// Route pour récupérer un dinosaure par son ID
router.get('/:id', dinosaurController.getDinosaurById);

// Route pour créer un dinosaure
router.post('/', dinosaurController.createDinosaur);

// Route pour mettre à jour un dinosaure
router.put('/:id', dinosaurController.updateDinosaur);

// Route pour supprimer un dinosaure
router.delete('/:id', dinosaurController.deleteDinosaur);

module.exports = router;
