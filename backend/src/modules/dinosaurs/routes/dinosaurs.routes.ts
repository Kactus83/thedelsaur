import { Router } from 'express';
import { authenticateJWT } from '../../auth/middlewares/authMiddleware';
import { DinosaursController } from '../controllers/dinosaur.controller';
import { BasicActionsController } from '../controllers/basic-actions.controller';
import { CarnivoreActionsController } from '../controllers/carnivore-actions.controller';
import { HerbivoreActionsController } from '../controllers/herbivore-actions.controller';
import { AdvancedActionsController } from '../controllers/advanced-actions.controller';

/**
 * Définit les routes pour les dinosaures.
 * @param dinosaursController Instance de DinosaursController.
 * @param basicActionsController Instance de BasicActionsController.
 * @param carnivoreActionsController Instance de CarnivoreActionsController.
 * @param herbivoreActionsController Instance de HerbivoreActionsController.
 * @param advancedActionsController Instance de AdvancedActionsController.
 * @returns Router avec les routes des dinosaures.
 */
export default function (
  dinosaursController: DinosaursController,
  basicActionsController: BasicActionsController,
  carnivoreActionsController: CarnivoreActionsController,
  herbivoreActionsController: HerbivoreActionsController,
  advancedActionsController: AdvancedActionsController
): Router {
  const router = Router();

  // Route pour obtenir les seuils d'époques
  router.get('/epochs/thresholds', (req, res) =>
    dinosaursController.getEpochThresholds(req, res)
  );

  // Routes générales
  router.get('/my-dinosaur', authenticateJWT, (req, res) =>
    dinosaursController.getMyDinosaur(req, res)
  );
  router.patch('/my-dinosaur/change-name', authenticateJWT, (req, res) =>
    dinosaursController.changeDinosaurName(req, res)
  );
  router.get('/my-dinosaur/next-level-xp', authenticateJWT, (req, res) =>
    dinosaursController.getNextLevelXp(req, res)
  );
  router.get('/my-dinosaur/actions', authenticateJWT, (req, res) =>
    dinosaursController.getAvailableActionsForDinosaur(req, res)
  );

  // Routes des actions basiques
  router.post('/actions/eat', authenticateJWT, (req, res) =>
    basicActionsController.eatDinosaur(req, res)
  );
  router.post('/actions/sleep', authenticateJWT, (req, res) =>
    basicActionsController.sleepDinosaur(req, res)
  );
  router.post('/actions/wake', authenticateJWT, (req, res) =>
    basicActionsController.wakeDinosaur(req, res)
  );
  router.post('/actions/resurrect', authenticateJWT, (req, res) =>
    basicActionsController.resurrectDinosaur(req, res)
  );

  // Routes des actions carnivores
  router.post('/actions/hunt', authenticateJWT, (req, res) =>
    carnivoreActionsController.huntDinosaur(req, res)
  );

  // Routes des actions herbivores
  router.post('/actions/graze', authenticateJWT, (req, res) =>
    herbivoreActionsController.grazeDinosaur(req, res)
  );

  // Routes des actions avancées
  router.post('/actions/steal', authenticateJWT, (req, res) =>
    advancedActionsController.stealDinosaur(req, res)
  );
  router.post('/actions/discover', authenticateJWT, (req, res) =>
    advancedActionsController.discoverDinosaur(req, res)
  );

  return router;
}
