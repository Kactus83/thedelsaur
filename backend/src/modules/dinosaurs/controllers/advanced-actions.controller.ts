import { Response } from 'express';
import { AuthenticatedRequest } from '../../auth/middlewares/authMiddleware';
import { plainToInstance } from 'class-transformer';
import { AdvancedActionsService } from '../services/advanced-actions.service';
import { FrontendDinosaurDTO } from '../models/frontend-dinosaur.dto';

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

            const dinosaur = req.dinosaur;
            if (!dinosaur) {
                res.status(400).json({ message: 'Dinosaure non trouvé pour l utilisateur' });
                return;
            }

            const { dinosaur: updatedDino, event } = await this.advancedActionsService.stealDinosaur(dinosaur);

            const dinosaurDTO = plainToInstance(FrontendDinosaurDTO, updatedDino);
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

            const dinosaur = req.dinosaur;
            if (!dinosaur) {
                res.status(400).json({ message: 'Dinosaure non trouvé pour l utilisateur' });
                return;
            }

            const { dinosaur: updatedDino, event } = await this.advancedActionsService.discoverDinosaur(dinosaur);

            const dinosaurDTO = plainToInstance(FrontendDinosaurDTO, updatedDino);
            res.status(200).json({ message: 'Action réussie', dinosaur: dinosaurDTO, event });
        } catch (error) {
            console.error('Erreur lors de l\'action découvrir du dinosaure:', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    };

    /**
     * Action pour faire prierle dinosaur
     */
    public prayDinosaur = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(400).json({ message: 'Utilisateur non authentifié' });
                return;
            }

            const dinosaur = req.dinosaur;
            if (!dinosaur) {
                res.status(400).json({ message: 'Dinosaure non trouvé pour l utilisateur' });
                return;
            }

            const { dinosaur: updatedDino, event } = await this.advancedActionsService.prayDinosaur(dinosaur);

            const dinosaurDTO = plainToInstance(FrontendDinosaurDTO, updatedDino);
            res.status(200).json({ message: 'Action réussie', dinosaur: dinosaurDTO, event });
        } catch (error) {
            console.error('Erreur lors de l\'action prier du dinosaure:', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    }
}
