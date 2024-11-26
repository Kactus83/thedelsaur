import { Router } from 'express';
import { authenticateJWT } from '../../auth/middlewares/authMiddleware';
import { DinosaursController } from '../controllers/dinosaur.controller';
import { BasicActionsController } from '../controllers/basic-actions.controller';
import { CarnivoreActionsController } from '../controllers/carnivore-actions.controller';
import { HerbivoreActionsController } from '../controllers/herbivore-actions.controller';
import { AdvancedActionsController } from '../controllers/advanced-actions.controller';
import { DinosaurMiddleware } from '../middlewares/dinosaur.middleware';

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
  advancedActionsController: AdvancedActionsController,
  dinosaurMiddleware: DinosaurMiddleware
): Router {
  const router = Router();

  // Route pour obtenir les seuils d'époques
  router.get('/epochs/thresholds', (req, res) =>
    dinosaursController.getEpochThresholds(req, res)
  );

  // Routes générales
  router.get('/my-dinosaur', authenticateJWT, dinosaurMiddleware.fetchAndUpdateDinosaur, (req, res) =>
    dinosaursController.getMyDinosaur(req, res)
  );
  router.patch('/my-dinosaur/change-name', authenticateJWT, dinosaurMiddleware.fetchAndUpdateDinosaur, (req, res) =>
    dinosaursController.changeDinosaurName(req, res)
  );
  router.get('/my-dinosaur/next-level-xp', authenticateJWT, dinosaurMiddleware.fetchAndUpdateDinosaur, (req, res) =>
    dinosaursController.getNextLevelXp(req, res)
  );
  router.get('/my-dinosaur/actions', authenticateJWT, dinosaurMiddleware.fetchAndUpdateDinosaur, (req, res) =>
    dinosaursController.getAvailableActionsForDinosaur(req, res)
  );

  // Routes des actions basiques
  router.post('/actions/eat', authenticateJWT, dinosaurMiddleware.fetchAndUpdateDinosaur, (req, res) =>
    basicActionsController.eatDinosaur(req, res)
  );
  router.post('/actions/sleep', authenticateJWT, dinosaurMiddleware.fetchAndUpdateDinosaur, (req, res) =>
    basicActionsController.sleepDinosaur(req, res)
  );
  router.post('/actions/wake', authenticateJWT, dinosaurMiddleware.fetchAndUpdateDinosaur, (req, res) =>
    basicActionsController.wakeDinosaur(req, res)
  );
  router.post('/actions/resurrect', authenticateJWT, dinosaurMiddleware.fetchAndUpdateDinosaur, (req, res) =>
    basicActionsController.resurrectDinosaur(req, res)
  );

  // Routes des actions carnivores
  router.post('/actions/hunt', authenticateJWT, dinosaurMiddleware.fetchAndUpdateDinosaur, (req, res) =>
    carnivoreActionsController.huntDinosaur(req, res)
  );

  // Routes des actions herbivores
  router.post('/actions/graze', authenticateJWT, dinosaurMiddleware.fetchAndUpdateDinosaur, (req, res) =>
    herbivoreActionsController.grazeDinosaur(req, res)
  );

  // Routes des actions avancées
  router.post('/actions/steal', authenticateJWT, dinosaurMiddleware.fetchAndUpdateDinosaur, (req, res) =>
    advancedActionsController.stealDinosaur(req, res)
  );
  router.post('/actions/discover', authenticateJWT, dinosaurMiddleware.fetchAndUpdateDinosaur, (req, res) =>
    advancedActionsController.discoverDinosaur(req, res)
  );

  router.post('/actions/pray', authenticateJWT, dinosaurMiddleware.fetchAndUpdateDinosaur, (req, res) =>
    advancedActionsController.prayDinosaur(req, res)
  );

  return router;
}
