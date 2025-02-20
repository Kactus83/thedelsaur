import { Request, Response } from 'express';
import { GameplayService } from '../services/gameplay.service';

/**
 * Contrôleur pour gérer les actions de gameplay (activation de skills, consommation d'items).
 */
export class GameplayController {
  private gameplayService: GameplayService;

  constructor(gameplayService: GameplayService) {
    this.gameplayService = gameplayService;
  }

  public activateSkill = async (req: Request, res: Response) => {
    try {
      const dinosaurId = Number(req.params.dinosaurId);
      const skillId = Number(req.body.skillId);
      const updatedDino = await this.gameplayService.activateSkill(dinosaurId, skillId);
      res.status(200).json(updatedDino);
    } catch (error) {
      console.error('Erreur lors de l\'activation du skill:', error);
      res.status(500).json({ message: 'Erreur lors de l\'activation du skill' });
    }
  };

  public consumeItem = async (req: Request, res: Response) => {
    try {
      const dinosaurId = Number(req.params.dinosaurId);
      const itemId = Number(req.body.itemId);
      const updatedDino = await this.gameplayService.consumeItem(dinosaurId, itemId);
      res.status(200).json(updatedDino);
    } catch (error) {
      console.error('Erreur lors de la consommation de l\'item:', error);
      res.status(500).json({ message: 'Erreur lors de la consommation de l\'item' });
    }
  };
}
