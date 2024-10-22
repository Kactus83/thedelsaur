import { Request, Response } from 'express';
import { DinosaursService } from '../services/dinosaurs.service';
import { AuthenticatedRequest } from '../../auth/middlewares/authMiddleware';
import { DinosaurDTO } from '../models/dinosaur.dto';
import { plainToInstance } from 'class-transformer';
import { DinosaurTimeService } from '../services/dinosaur-time.service';
import { DinosaurActionService } from '../services/dinosaur-action.service';
import { getAvailableActions } from '../utils/dinosaur-actions.util';

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

  // Méthode pour obtenir les actions disponibles pour un dinosaure
  public getAvailableActionsForDinosaur = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(400).json({ message: 'Utilisateur non authentifié' });
        return;
      }

      let dinosaur = await this.dinosaursService.getDinosaurByUserId(userId);

      if (!dinosaur) {
        res.status(404).json({ message: 'Dinosaure non trouvé' });
        return;
      }

      // Ajuster les statistiques du dinosaure en fonction du temps
      dinosaur = this.dinosaurTimeService.adjustDinosaurStats(dinosaur);

      // Obtenir les actions disponibles
      const availableActions = getAvailableActions(dinosaur);

      res.status(200).json({
        dinosaur: plainToInstance(DinosaurDTO, dinosaur),
        availableActions,
      });
      return;
    } catch (error) {
      console.error('Erreur lors de la récupération des actions disponibles pour le dinosaure:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };

  public getMyDinosaur = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(400).json({ message: 'Utilisateur non authentifié' });
        return;
      }

      let dinosaur = await this.dinosaursService.getDinosaurByUserId(userId);

      if (!dinosaur) {
        res.status(404).json({ message: 'Dinosaure non trouvé' });
        return;
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
      return;
    } catch (error) {
      console.error('Erreur lors de la récupération du dinosaure:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
      return;
    }
  };

  public eatDinosaur = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(400).json({ message: 'Utilisateur non authentifié' });
        return;
      }

      let dinosaur = await this.dinosaursService.getDinosaurByUserId(userId);

      if (!dinosaur) {
        res.status(404).json({ message: 'Dinosaure non trouvé' });
        return;
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
      return;
    } catch (error) {
      console.error('Erreur lors de l\'action manger du dinosaure:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
      return;
    }
  };

  public sleepDinosaur = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(400).json({ message: 'Utilisateur non authentifié' });
        return;
      }

      let dinosaur = await this.dinosaursService.getDinosaurByUserId(userId);

      if (!dinosaur) {
        res.status(404).json({ message: 'Dinosaure non trouvé' });
        return;
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
      return;
    } catch (error) {
      console.error('Erreur lors de l\'action dormir du dinosaure:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };

  public wakeDinosaur = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(400).json({ message: 'Utilisateur non authentifié' });
        return;
      }

      let dinosaur = await this.dinosaursService.getDinosaurByUserId(userId);

      if (!dinosaur) {
        res.status(404).json({ message: 'Dinosaure non trouvé' });
        return;
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
      return;
    } catch (error) {
      console.error('Erreur lors de l\'action réveiller du dinosaure:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };

  public resurrectDinosaur = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(400).json({ message: 'Utilisateur non authentifié' });
        return;
      }

      let dinosaur = await this.dinosaursService.getDinosaurByUserId(userId);

      if (!dinosaur) {
        res.status(404).json({ message: 'Dinosaure non trouvé' });
        return;
      }

      if (!dinosaur.isDead) {
        res.status(400).json({ message: 'Le dinosaure n\'est pas mort.' });
        return;
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
      return;
    } catch (error) {
      console.error('Erreur lors de l\'action ressusciter du dinosaure:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
      return;
    }
  };
}