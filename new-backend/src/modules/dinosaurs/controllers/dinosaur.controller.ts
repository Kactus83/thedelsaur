import { Request, Response } from 'express';
import { DinosaursService } from '../services/dinosaurs.service';
import { AuthenticatedRequest } from '../../auth/middlewares/authMiddleware';
import { DinosaurDTO } from '../models/dinosaur.dto';
import { plainToInstance } from 'class-transformer';
import { DinosaurTimeService } from '../services/dinosaur-time.service';
import { DinosaurActionService } from '../services/dinosaur-action.service';

export class DinosaursController {
  private dinosaursService: DinosaursService;
  private dinosaurTimeService: DinosaurTimeService;
  private dinosaurActionService: DinosaurActionService;

  constructor(
    dinosaursService: DinosaursService,
    dinosaurTimeService: DinosaurTimeService,
    dinosaurActionService: DinosaurActionService
  ) {
    this.dinosaursService = dinosaursService;
    this.dinosaurTimeService = dinosaurTimeService;
    this.dinosaurActionService = dinosaurActionService;
  }

  public getMyDinosaur = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(400).json({ message: 'Utilisateur non authentifié' });
      }

      let dinosaur = await this.dinosaursService.getDinosaurByUserId(userId);

      if (!dinosaur) {
        return res.status(404).json({ message: 'Dinosaure non trouvé' });
      }

      // Ajuster les statistiques du dinosaure en fonction du temps
      dinosaur = this.dinosaurTimeService.adjustDinosaurStats(dinosaur);

      // Sauvegarder les nouvelles valeurs du dinosaure
      await this.dinosaursService.updateDinosaur(dinosaur.id, {
        food: dinosaur.food,
        energy: dinosaur.energy,
        last_update_by_time_service: dinosaur.last_update_by_time_service,
        isDead: dinosaur.isDead,
        isSleeping: dinosaur.isSleeping,
      });

      const dinosaurDTO = plainToInstance(DinosaurDTO, dinosaur);
      res.status(200).json(dinosaurDTO);
    } catch (error) {
      console.error('Erreur lors de la récupération du dinosaure:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };

  public eatDinosaur = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(400).json({ message: 'Utilisateur non authentifié' });
      }

      let dinosaur = await this.dinosaursService.getDinosaurByUserId(userId);

      if (!dinosaur) {
        return res.status(404).json({ message: 'Dinosaure non trouvé' });
      }

      // Effectuer l'action de manger
      dinosaur = this.dinosaurActionService.eatDinosaur(dinosaur);

      // Ajuster les statistiques du dinosaure en fonction du temps
      dinosaur = this.dinosaurTimeService.adjustDinosaurStats(dinosaur);

      // Sauvegarder les nouvelles valeurs du dinosaure
      await this.dinosaursService.updateDinosaur(dinosaur.id, {
        food: dinosaur.food,
        energy: dinosaur.energy,
        last_update_by_time_service: dinosaur.last_update_by_time_service,
        isDead: dinosaur.isDead,
        isSleeping: dinosaur.isSleeping,
      });

      const dinosaurDTO = plainToInstance(DinosaurDTO, dinosaur);
      res.status(200).json({ message: 'Action réussie', dinosaur: dinosaurDTO });
    } catch (error) {
      console.error('Erreur lors de l\'action manger du dinosaure:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };

  public sleepDinosaur = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(400).json({ message: 'Utilisateur non authentifié' });
      }

      let dinosaur = await this.dinosaursService.getDinosaurByUserId(userId);

      if (!dinosaur) {
        return res.status(404).json({ message: 'Dinosaure non trouvé' });
      }

      // Effectuer l'action de dormir
      dinosaur = this.dinosaurActionService.sleepDinosaur(dinosaur);

      // Ajuster les statistiques du dinosaure en fonction du temps
      dinosaur = this.dinosaurTimeService.adjustDinosaurStats(dinosaur);

      // Sauvegarder les nouvelles valeurs du dinosaure
      await this.dinosaursService.updateDinosaur(dinosaur.id, {
        food: dinosaur.food,
        energy: dinosaur.energy,
        last_update_by_time_service: dinosaur.last_update_by_time_service,
        isDead: dinosaur.isDead,
        isSleeping: dinosaur.isSleeping,
      });

      const dinosaurDTO = plainToInstance(DinosaurDTO, dinosaur);
      res.status(200).json({ message: 'Le dinosaure est maintenant en sommeil.', dinosaur: dinosaurDTO });
    } catch (error) {
      console.error('Erreur lors de l\'action dormir du dinosaure:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };

  public wakeDinosaur = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(400).json({ message: 'Utilisateur non authentifié' });
      }

      let dinosaur = await this.dinosaursService.getDinosaurByUserId(userId);

      if (!dinosaur) {
        return res.status(404).json({ message: 'Dinosaure non trouvé' });
      }

      // Effectuer l'action de se réveiller
      dinosaur = this.dinosaurActionService.wakeDinosaur(dinosaur);

      // Ajuster les statistiques du dinosaure en fonction du temps
      dinosaur = this.dinosaurTimeService.adjustDinosaurStats(dinosaur);

      // Sauvegarder les nouvelles valeurs du dinosaure
      await this.dinosaursService.updateDinosaur(dinosaur.id, {
        food: dinosaur.food,
        energy: dinosaur.energy,
        last_update_by_time_service: dinosaur.last_update_by_time_service,
        isDead: dinosaur.isDead,
        isSleeping: dinosaur.isSleeping,
      });

      const dinosaurDTO = plainToInstance(DinosaurDTO, dinosaur);
      res.status(200).json({ message: 'Le dinosaure s\'est réveillé.', dinosaur: dinosaurDTO });
    } catch (error) {
      console.error('Erreur lors de l\'action réveiller du dinosaure:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };

  public resurrectDinosaur = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(400).json({ message: 'Utilisateur non authentifié' });
      }

      let dinosaur = await this.dinosaursService.getDinosaurByUserId(userId);

      if (!dinosaur) {
        return res.status(404).json({ message: 'Dinosaure non trouvé' });
      }

      if (!dinosaur.isDead) {
        return res.status(400).json({ message: 'Le dinosaure n\'est pas mort.' });
      }

      // Effectuer l'action de ressusciter
      dinosaur = this.dinosaurActionService.resurrectDinosaur(dinosaur);

      // Ajuster les statistiques du dinosaure en fonction du temps
      dinosaur = this.dinosaurTimeService.adjustDinosaurStats(dinosaur);

      // Sauvegarder les nouvelles valeurs du dinosaure
      await this.dinosaursService.updateDinosaur(dinosaur.id, {
        food: dinosaur.food,
        energy: dinosaur.energy,
        last_update_by_time_service: dinosaur.last_update_by_time_service,
        isDead: dinosaur.isDead,
        isSleeping: dinosaur.isSleeping,
      });

      const dinosaurDTO = plainToInstance(DinosaurDTO, dinosaur);
      res.status(200).json({ message: 'Le dinosaure a été ressuscité.', dinosaur: dinosaurDTO });
    } catch (error) {
      console.error('Erreur lors de l\'action ressusciter du dinosaure:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };
}