import { Response } from 'express';
import { AuthenticatedRequest } from '../../auth/middlewares/authMiddleware';
import { plainToInstance } from 'class-transformer';
import { CarnivoreActionsService } from '../services/carnivore-actions.service';
import { FrontendDinosaurDTO } from '../models/frontend-dinosaur.dto';

/**
 * Contrôleur pour les actions spécifiques aux dinosaures carnivores (chasser).
 */
export class CarnivoreActionsController {
    private carnivoreActionsService: CarnivoreActionsService;

    constructor(carnivoreActionsService: CarnivoreActionsService) {
        this.carnivoreActionsService = carnivoreActionsService;
    }

    /**
     * Action pour chasser le dinosaure carnivore.
     */
    public huntDinosaur = async (req: AuthenticatedRequest, res: Response) => {
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

            const { dinosaur: updatedDino, event } = await this.carnivoreActionsService.huntDinosaur(dinosaur);

            const dinosaurDTO = plainToInstance(FrontendDinosaurDTO, updatedDino);
            res.status(200).json({ message: 'Action réussie', dinosaur: dinosaurDTO, event });
        } catch (error) {
            console.error('Erreur lors de l\'action chasser du dinosaure:', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    };
}
