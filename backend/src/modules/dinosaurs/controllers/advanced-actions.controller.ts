import { Response } from 'express';
import { AuthenticatedRequest } from '../../auth/middlewares/authMiddleware';
import { DinosaurDTO } from '../models/dinosaur.dto';
import { plainToInstance } from 'class-transformer';
import { AdvancedActionsService } from '../services/advanced-actions.service';

/**
 * Contrôleur pour les actions avancées du dinosaure (voler, découvrir).
 */
export class AdvancedActionsController {
    private advancedActionsService: AdvancedActionsService;

    constructor(advancedActionsService: AdvancedActionsService) {
        this.advancedActionsService = advancedActionsService;
    }

    /**
     * Action pour voler le dinosaure.
     */
    public stealDinosaur = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(400).json({ message: 'Utilisateur non authentifié' });
                return;
            }

            const dinosaur = await this.advancedActionsService.getDinosaurByUserId(userId);
            if (!dinosaur) {
                res.status(404).json({ message: 'Dinosaure non trouvé' });
                return;
            }

            const { dinosaur: updatedDino, event } = this.advancedActionsService.stealDinosaur(dinosaur);

            await this.advancedActionsService.updateDinosaur(updatedDino);

            const dinosaurDTO = plainToInstance(DinosaurDTO, updatedDino);
            res.status(200).json({ message: 'Action réussie', dinosaur: dinosaurDTO, event });
        } catch (error) {
            console.error('Erreur lors de l\'action voler du dinosaure:', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    };

    /**
     * Action pour découvrir le dinosaure.
     */
    public discoverDinosaur = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(400).json({ message: 'Utilisateur non authentifié' });
                return;
            }

            const dinosaur = await this.advancedActionsService.getDinosaurByUserId(userId);
            if (!dinosaur) {
                res.status(404).json({ message: 'Dinosaure non trouvé' });
                return;
            }

            const { dinosaur: updatedDino, event } = this.advancedActionsService.discoverDinosaur(dinosaur);

            await this.advancedActionsService.updateDinosaur(updatedDino);

            const dinosaurDTO = plainToInstance(DinosaurDTO, updatedDino);
            res.status(200).json({ message: 'Action réussie', dinosaur: dinosaurDTO, event });
        } catch (error) {
            console.error('Erreur lors de l\'action découvrir du dinosaure:', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    };
}
