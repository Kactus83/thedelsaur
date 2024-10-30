import { Router } from 'express';
import { DinosaursService } from './services/dinosaurs.service';
import dinosaursRoutes from './routes/dinosaurs.routes';
import { DinosaurTimeService } from './services/dinosaur-time.service';
import { DinosaurActionService } from './services/dinosaur-action.service';
import { DinosaursController } from './controllers/dinosaur.controller';

export class DinosaursModule {
  public router: Router;
  private dinosaursService: DinosaursService;
  private dinosaurTimeService: DinosaurTimeService;
  private dinosaurActionService: DinosaurActionService;
  private dinosaursController: DinosaursController;

  constructor() {
    this.dinosaursService = new DinosaursService();
    this.dinosaurTimeService = new DinosaurTimeService();
    this.dinosaurActionService = new DinosaurActionService();
    this.dinosaursController = new DinosaursController(
      this.dinosaursService,
      this.dinosaurTimeService,
      this.dinosaurActionService
    );
    this.router = dinosaursRoutes(this.dinosaursController);
  }
}