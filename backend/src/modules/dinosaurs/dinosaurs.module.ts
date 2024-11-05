import { Router } from 'express';
import { DinosaursService } from './services/dinosaurs.service';
import { DinosaurTimeService } from './services/dinosaur-time.service';
import { BasicActionsService } from './services/basic-actions.service';
import { CarnivoreActionsService } from './services/carnivore-actions.service';
import { HerbivoreActionsService } from './services/herbivore-action.service';
import { AdvancedActionsService } from './services/advanced-actions.service';
import { DinosaursController } from './controllers/dinosaur.controller';
import { BasicActionsController } from './controllers/basic-actions.controller';
import { CarnivoreActionsController } from './controllers/carnivore-actions.controller';
import { HerbivoreActionsController } from './controllers/herbivore-actions.controller';
import { AdvancedActionsController } from './controllers/advanced-actions.controller';
import dinosaursRoutes from './routes/dinosaurs.routes';

/**
 * Module Dinosaurs.
 * Instancie les services et contrôleurs, et configure les routes.
 */
export class DinosaursModule {
  public router: Router;

  // Services principaux
  private dinosaursService: DinosaursService;
  private dinosaurTimeService: DinosaurTimeService;

  // Services spécifiques
  private basicActionsService: BasicActionsService;
  private carnivoreActionsService: CarnivoreActionsService;
  private herbivoreActionsService: HerbivoreActionsService;
  private advancedActionsService: AdvancedActionsService;

  // Contrôleurs
  private dinosaursController: DinosaursController;
  private basicActionsController: BasicActionsController;
  private carnivoreActionsController: CarnivoreActionsController;
  private herbivoreActionsController: HerbivoreActionsController;
  private advancedActionsController: AdvancedActionsController;

  constructor() {
    // Initialisation du service principal
    this.dinosaursService = new DinosaursService();

    // Initialisation des services spécifiques
    this.basicActionsService = new BasicActionsService(this.dinosaursService);
    this.carnivoreActionsService = new CarnivoreActionsService(this.dinosaursService);
    this.herbivoreActionsService = new HerbivoreActionsService(this.dinosaursService);
    this.advancedActionsService = new AdvancedActionsService(this.dinosaursService);

    // Initialisation du time service.
    this.dinosaurTimeService = new DinosaurTimeService(this.basicActionsService);

    // Initialisation des contrôleurs
    this.dinosaursController = new DinosaursController(this.dinosaursService, this.dinosaurTimeService);
    this.basicActionsController = new BasicActionsController(this.basicActionsService);
    this.carnivoreActionsController = new CarnivoreActionsController(this.carnivoreActionsService);
    this.herbivoreActionsController = new HerbivoreActionsController(this.herbivoreActionsService);
    this.advancedActionsController = new AdvancedActionsController(this.advancedActionsService);

    // Initialisation du routage avec tous les contrôleurs
    this.router = dinosaursRoutes(
      this.dinosaursController,
      this.basicActionsController,
      this.carnivoreActionsController,
      this.herbivoreActionsController,
      this.advancedActionsController
    );
  }
}
