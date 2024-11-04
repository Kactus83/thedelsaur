import { Response, Request } from 'express';
import { DinosaursService } from '../services/dinosaurs.service';
import { AuthenticatedRequest } from '../../auth/middlewares/authMiddleware';
import { DinosaurDTO } from '../models/dinosaur.dto';
import { plainToInstance } from 'class-transformer';
import { Dinosaur } from '../models/dinosaur.interface';
import { DinosaurTimeService } from '../services/dinosaur-time.service';
import { DinosaurActionService } from '../services/dinosaur-action.service';
import { getAvailableActions, getExperienceThresholdForLevel } from '../utils/dinosaur-actions.util';
import { DinosaurActionDTO } from '../models/dinosaur-action.dto';
import { ChangeDinosaurNameRequestBody } from '../models/change-dinosaur-name.dto';

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

      let dinosaur: Dinosaur | null = await this.dinosaursService.getDinosaurByUserId(userId);

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
        hunger: dinosaur.hunger,
        last_update_by_time_service: dinosaur.last_update_by_time_service,
        isDead: dinosaur.isDead,
        isSleeping: dinosaur.isSleeping,
        level: dinosaur.level,
        epoch: dinosaur.epoch,
        experience: dinosaur.experience,
      });

      // Obtenir les actions disponibles avec leurs détails
      const availableActions = getAvailableActions(dinosaur);

      res.status(200).json({
        dinosaur: plainToInstance(DinosaurDTO, dinosaur),
        availableActions: plainToInstance(DinosaurActionDTO, availableActions),
      });
    } catch (error) {
      console.error('Erreur lors de la récupération des actions disponibles pour le dinosaure:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };

  public getNextLevelXp = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(400).json({ message: 'Utilisateur non authentifié' });
        return;
      }
  
      let dinosaur: Dinosaur | null = await this.dinosaursService.getDinosaurByUserId(userId);
  
      if (!dinosaur) {
        res.status(404).json({ message: 'Dinosaure non trouvé' });
        return;
      }
  
      // Calcul de la valeur d'expérience nécessaire pour le prochain niveau
      const nextLevelXp = getExperienceThresholdForLevel(dinosaur.level + 1);
  
      res.status(200).json({ nextLevelXp });
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'expérience nécessaire pour le prochain niveau:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };

  // Méthode pour obtenir les informations du dinosaure de l'utilisateur
  public getMyDinosaur = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(400).json({ message: 'Utilisateur non authentifié' });
        return;
      }

      let dinosaur: Dinosaur | null = await this.dinosaursService.getDinosaurByUserId(userId);

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
        hunger: dinosaur.hunger,
        last_update_by_time_service: dinosaur.last_update_by_time_service,
        isDead: dinosaur.isDead,
        isSleeping: dinosaur.isSleeping,
        level: dinosaur.level,
        epoch: dinosaur.epoch,
        experience: dinosaur.experience,
      });

      const dinosaurDTO = plainToInstance(DinosaurDTO, dinosaur);
      res.status(200).json(dinosaurDTO);
    } catch (error) {
      console.error('Erreur lors de la récupération du dinosaure:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };

  // Méthode pour changer le nom du dinosaure de l'utilisateur
  public changeDinosaurName = async (
    req: AuthenticatedRequest & Request<{}, {}, ChangeDinosaurNameRequestBody>,
    res: Response
  ) => {
    try {
      const userId = req.user?.id;
      const newName = req.body.name;

      if (!userId) {
        res.status(400).json({ message: 'Utilisateur non authentifié' });
        return;
      }

      if (!newName || typeof newName !== 'string' || newName.trim().length === 0) {
        res.status(400).json({ message: 'Nom invalide' });
        return;
      }

      const updated = await this.dinosaursService.updateDinosaurName(userId, newName.trim());
      if (!updated) {
        res.status(404).json({ message: 'Dinosaure non trouvé' });
        return;
      }

      res.status(200).json({ message: 'Nom du dinosaure mis à jour avec succès', newName });
    } catch (error) {
      console.error('Erreur lors du changement de nom du dinosaure:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };

  // Méthodes d'action qui retournent également l'événement exécuté

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

      const { dinosaur: updatedDino, event } = this.dinosaurActionService.eatDinosaur(dinosaur);
      dinosaur = updatedDino;

      await this.dinosaursService.updateDinosaur(dinosaur.id, {
        food: dinosaur.food,
        energy: dinosaur.energy,
        hunger: dinosaur.hunger,
        last_update_by_time_service: dinosaur.last_update_by_time_service,
        isDead: dinosaur.isDead,
        isSleeping: dinosaur.isSleeping,
        level: dinosaur.level,
        epoch: dinosaur.epoch,
        experience: dinosaur.experience,
      });

      const dinosaurDTO = plainToInstance(DinosaurDTO, dinosaur);
      res.status(200).json({ message: 'Action réussie', dinosaur: dinosaurDTO, event });
    } catch (error) {
      console.error('Erreur lors de l\'action manger du dinosaure:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
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

      const { dinosaur: updatedDino, event } = this.dinosaurActionService.sleepDinosaur(dinosaur);
      dinosaur = updatedDino;

      await this.dinosaursService.updateDinosaur(dinosaur.id, {
        food: dinosaur.food,
        energy: dinosaur.energy,
        hunger: dinosaur.hunger,
        last_update_by_time_service: dinosaur.last_update_by_time_service,
        isDead: dinosaur.isDead,
        isSleeping: dinosaur.isSleeping,
        level: dinosaur.level,
        epoch: dinosaur.epoch,
        experience: dinosaur.experience,
      });

      const dinosaurDTO = plainToInstance(DinosaurDTO, dinosaur);
      res.status(200).json({ message: 'Le dinosaure est maintenant en sommeil.', dinosaur: dinosaurDTO, event });
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

      const { dinosaur: updatedDino, event } = this.dinosaurActionService.wakeDinosaur(dinosaur);
      dinosaur = updatedDino;

      await this.dinosaursService.updateDinosaur(dinosaur.id, {
        food: dinosaur.food,
        energy: dinosaur.energy,
        hunger: dinosaur.hunger,
        last_update_by_time_service: dinosaur.last_update_by_time_service,
        isDead: dinosaur.isDead,
        isSleeping: dinosaur.isSleeping,
        level: dinosaur.level,
        epoch: dinosaur.epoch,
        experience: dinosaur.experience,
      });

      const dinosaurDTO = plainToInstance(DinosaurDTO, dinosaur);
      res.status(200).json({ message: 'Le dinosaure s\'est réveillé.', dinosaur: dinosaurDTO, event });
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

      const { dinosaur: updatedDino, event } = this.dinosaurActionService.resurrectDinosaur(dinosaur);
      dinosaur = updatedDino;

      await this.dinosaursService.updateDinosaur(dinosaur.id, {
        type: dinosaur.type,
        diet: dinosaur.diet,
        food: dinosaur.food,
        energy: dinosaur.energy,
        hunger: dinosaur.hunger,
        last_update_by_time_service: dinosaur.last_update_by_time_service,
        isDead: dinosaur.isDead,
        isSleeping: dinosaur.isSleeping,
        level: dinosaur.level,
        epoch: dinosaur.epoch,
        experience: dinosaur.experience,
        reborn_amount: dinosaur.reborn_amount,
        last_reborn: dinosaur.last_reborn,
        karma: dinosaur.karma,    
      });

      const dinosaurDTO = plainToInstance(DinosaurDTO, dinosaur);
      res.status(200).json({ message: 'Le dinosaure a été ressuscité.', dinosaur: dinosaurDTO, event });
    } catch (error) {
      console.error('Erreur lors de l\'action ressusciter du dinosaure:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };

  public grazeDinosaur = async (req: AuthenticatedRequest, res: Response) => {
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

      const { dinosaur: updatedDino, event } = this.dinosaurActionService.grazeDinosaur(dinosaur);
      dinosaur = updatedDino;

      await this.dinosaursService.updateDinosaur(dinosaur.id, {
        food: dinosaur.food,
        energy: dinosaur.energy,
        hunger: dinosaur.hunger,
        last_update_by_time_service: dinosaur.last_update_by_time_service,
        isDead: dinosaur.isDead,
        isSleeping: dinosaur.isSleeping,
        level: dinosaur.level,
        epoch: dinosaur.epoch,
        experience: dinosaur.experience,
      });

      const dinosaurDTO = plainToInstance(DinosaurDTO, dinosaur);
      res.status(200).json({ message: 'Action réussie', dinosaur: dinosaurDTO, event });
    } catch (error) {
      console.error('Erreur lors de l\'action cueillir du dinosaure:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };

  public huntDinosaur = async (req: AuthenticatedRequest, res: Response) => {
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

      const { dinosaur: updatedDino, event } = this.dinosaurActionService.huntDinosaur(dinosaur);
      dinosaur = updatedDino;

      await this.dinosaursService.updateDinosaur(dinosaur.id, {
        food: dinosaur.food,
        energy: dinosaur.energy,
        hunger: dinosaur.hunger,
        last_update_by_time_service: dinosaur.last_update_by_time_service,
        isDead: dinosaur.isDead,
        isSleeping: dinosaur.isSleeping,
        level: dinosaur.level,
        epoch: dinosaur.epoch,
        experience: dinosaur.experience,
      });

      const dinosaurDTO = plainToInstance(DinosaurDTO, dinosaur);
      res.status(200).json({ message: 'Action réussie', dinosaur: dinosaurDTO, event });
    } catch (error) {
      console.error('Erreur lors de l\'action chasser du dinosaure:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };

  public discoverDinosaur = async (req: AuthenticatedRequest, res: Response) => {
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

      const { dinosaur: updatedDino, event } = this.dinosaurActionService.discoverDinosaur(dinosaur);
      dinosaur = updatedDino;

      await this.dinosaursService.updateDinosaur(dinosaur.id, {
        food: dinosaur.food,
        energy: dinosaur.energy,
        hunger: dinosaur.hunger,
        last_update_by_time_service: dinosaur.last_update_by_time_service,
        isDead: dinosaur.isDead,
        isSleeping: dinosaur.isSleeping,
        level: dinosaur.level,
        epoch: dinosaur.epoch,
        experience: dinosaur.experience,
      });

      const dinosaurDTO = plainToInstance(DinosaurDTO, dinosaur);
      res.status(200).json({ message: 'Action réussie', dinosaur: dinosaurDTO, event });
    } catch (error) {
      console.error('Erreur lors de l\'action découvrir du dinosaure:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  }

  public stealDinosaur = async (req: AuthenticatedRequest, res: Response) => {
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

      const { dinosaur: updatedDino, event } = this.dinosaurActionService.stealDinosaur(dinosaur);
      dinosaur = updatedDino;

      await this.dinosaursService.updateDinosaur(dinosaur.id, {
        food: dinosaur.food,
        energy: dinosaur.energy,
        hunger: dinosaur.hunger,
        last_update_by_time_service: dinosaur.last_update_by_time_service,
        isDead: dinosaur.isDead,
        isSleeping: dinosaur.isSleeping,
        level: dinosaur.level,
        epoch: dinosaur.epoch,
        experience: dinosaur.experience,
      });

      const dinosaurDTO = plainToInstance(DinosaurDTO, dinosaur);
      res.status(200).json({ message: 'Action réussie', dinosaur: dinosaurDTO, event });
    } catch (error) {
      console.error('Erreur lors de l\'action voler du dinosaure:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  }
}
