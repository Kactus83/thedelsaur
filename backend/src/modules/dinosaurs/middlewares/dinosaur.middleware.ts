import { Request, Response, NextFunction } from 'express';
import { Dinosaur } from '../models/backend-dinosaur.interface';
import { DinosaurRepository } from '../repositories/dinosaur.repository';
import { DinosaurTimeService } from '../services/dinosaur-time.service';
import { AuthenticatedRequest } from '../../auth/middlewares/authMiddleware';

/**
 * Middleware pour récupérer et mettre à jour le dinosaure avant chaque requête.
 */
export class DinosaurMiddleware {
  private dinosaurRepository: DinosaurRepository;
  private dinosaurTimeService: DinosaurTimeService;

  constructor(
    dinosaurRepository: DinosaurRepository,
    dinosaurTimeService: DinosaurTimeService
  ) {
    this.dinosaurRepository = dinosaurRepository;
    this.dinosaurTimeService = dinosaurTimeService;
  }

  public fetchAndUpdateDinosaur = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(400).json({ message: 'Utilisateur non authentifié' });
        return;
      }

      let dinosaur: Dinosaur | null = await this.dinosaurRepository.getDinosaurByUserId(userId);

      if (!dinosaur) {
        res.status(404).json({ message: 'Dinosaure non trouvé' });
        return;
      }

      // Ajuster les statistiques du dinosaure en fonction du temps
      dinosaur = this.dinosaurTimeService.adjustDinosaurStats(dinosaur);

      // Sauvegarder les nouvelles valeurs du dinosaure
      await this.dinosaurRepository.updateDinosaur(dinosaur.id, {
        food: dinosaur.food,
        energy: dinosaur.energy,
        hunger: dinosaur.hunger,
        max_hunger: dinosaur.max_hunger,
        last_update_by_time_service: dinosaur.last_update_by_time_service,
        isDead: dinosaur.isDead,
        isSleeping: dinosaur.isSleeping,
        level: dinosaur.level,
        epoch: dinosaur.epoch,
        experience: dinosaur.experience,
      });

      // Attacher le dinosaure mis à jour à la requête
      req.dinosaur = dinosaur;
      next();
    } catch (error) {
      console.error('Erreur dans le middleware de dinosaure:', error);
      res.status(500).json({ message: 'Erreur interne du serveur' });
    }
  };
}
