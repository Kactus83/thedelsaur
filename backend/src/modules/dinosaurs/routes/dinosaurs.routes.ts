import { Router } from 'express';
import { authenticateJWT } from '../../auth/middlewares/authMiddleware';
import { DinosaursController } from '../controllers/dinosaur.controller';

/**
 * Définit les routes pour les dinosaures.
 * @param dinosaursController Instance de DinosaursController.
 * @returns Router avec les routes des dinosaures.
 */
export default function (dinosaursController: DinosaursController): Router { 
  const router = Router();

  // Route pour récupérer le dinosaure de l'utilisateur connecté
  router.get('/my-dinosaur', authenticateJWT, (req, res) => dinosaursController.getMyDinosaur(req, res));

  // Route pour récupérer le dinosaure de l'utilisateur connecté
  router.patch('/my-dinosaur/change-name', authenticateJWT, (req, res) => dinosaursController.changeDinosaurName(req, res));
  
  // Route pour récupérer les actions effectuables par le dinosaure de l'utilisateur connecté
  router.get('/my-dinosaur/actions', authenticateJWT, (req, res) => dinosaursController.getAvailableActionsForDinosaur(req, res));

  // Actions
  router.post('/actions/eat', authenticateJWT, (req, res) => dinosaursController.eatDinosaur(req, res));
  router.post('/actions/sleep', authenticateJWT, (req, res) => dinosaursController.sleepDinosaur(req, res));
  router.post('/actions/wake', authenticateJWT, (req, res) => dinosaursController.wakeDinosaur(req, res));
  router.post('/actions/resurrect', authenticateJWT, (req, res) => dinosaursController.resurrectDinosaur(req, res));
  router.post('/actions/graze', authenticateJWT, (req, res) => dinosaursController.grazeDinosaur(req, res));
  router.post('/actions/hunt', authenticateJWT, (req, res) => dinosaursController.huntDinosaur(req, res));
  
  return router;
}