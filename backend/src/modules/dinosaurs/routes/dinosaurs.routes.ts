import { Router } from 'express';
import { authenticateJWT } from '../../auth/middlewares/authMiddleware';
import { DinosaursService } from '../services/dinosaurs.service';
import { DinosaurTimeService } from '../services/dinosaur-time.service';
import { BasicActionsService } from '../services/basic-actions.service';
import { CarnivoreActionsService } from '../services/carnivore-actions.service';
import { HerbivoreActionsService } from '../services/herbivore-action.service';
import { AdvancedActionsService } from '../services/advanced-actions.service';
import { DinosaursController } from '../controllers/dinosaur.controller';
import { BasicActionsController } from '../controllers/basic-actions.controller';
import { CarnivoreActionsController } from '../controllers/carnivore-actions.controller';
import { HerbivoreActionsController } from '../controllers/herbivore-actions.controller';
import { AdvancedActionsController } from '../controllers/advanced-actions.controller';

// Initialisation des services
const dinosaursService = new DinosaursService();
const dinosaurTimeService = new DinosaurTimeService();

// Initialisation des services spécifiques
const basicActionsService = new BasicActionsService(dinosaursService, dinosaurTimeService);
const carnivoreActionsService = new CarnivoreActionsService(dinosaursService, dinosaurTimeService);
const herbivoreActionsService = new HerbivoreActionsService(dinosaursService, dinosaurTimeService);
const advancedActionsService = new AdvancedActionsService(dinosaursService, dinosaurTimeService);

// Initialisation des contrôleurs
const dinosaursController = new DinosaursController(dinosaursService, dinosaurTimeService); 
const basicActionsController = new BasicActionsController(basicActionsService);
const carnivoreActionsController = new CarnivoreActionsController(carnivoreActionsService);
const herbivoreActionsController = new HerbivoreActionsController(herbivoreActionsService);
const advancedActionsController = new AdvancedActionsController(advancedActionsService);

export default function (): Router { 
    const router = Router();

    // Routes générales
    router.get('/my-dinosaur', authenticateJWT, (req, res) => dinosaursController.getMyDinosaur(req, res));
    router.patch('/my-dinosaur/change-name', authenticateJWT, (req, res) => dinosaursController.changeDinosaurName(req, res));
    router.get('/my-dinosaur/next-level-xp', authenticateJWT, (req, res) => dinosaursController.getNextLevelXp(req, res));
    router.get('/my-dinosaur/actions', authenticateJWT, (req, res) => dinosaursController.getAvailableActionsForDinosaur(req, res));

    // Routes des actions basiques
    router.post('/actions/eat', authenticateJWT, (req, res) => basicActionsController.eatDinosaur(req, res));
    router.post('/actions/sleep', authenticateJWT, (req, res) => basicActionsController.sleepDinosaur(req, res));
    router.post('/actions/wake', authenticateJWT, (req, res) => basicActionsController.wakeDinosaur(req, res));
    router.post('/actions/resurrect', authenticateJWT, (req, res) => basicActionsController.resurrectDinosaur(req, res));

    // Routes des actions carnivores
    router.post('/actions/hunt', authenticateJWT, (req, res) => carnivoreActionsController.huntDinosaur(req, res));

    // Routes des actions herbivores
    router.post('/actions/graze', authenticateJWT, (req, res) => herbivoreActionsController.grazeDinosaur(req, res));

    // Routes des actions avancées
    router.post('/actions/steal', authenticateJWT, (req, res) => advancedActionsController.stealDinosaur(req, res));
    router.post('/actions/discover', authenticateJWT, (req, res) => advancedActionsController.discoverDinosaur(req, res));

    return router;
}
