import { Response } from 'express';
import { AuthenticatedRequest } from '../../auth/middlewares/authMiddleware';
import { plainToInstance } from 'class-transformer';
import { HerbivoreActionsService } from '../services/herbivore-action.service';
import { FrontendDinosaurDTO } from '../models/frontend-dinosaur.dto';

/**
 * Contrôleur pour les actions spécifiques aux dinosaures herbivores (cueillir).
 */
export class HerbivoreActionsController {
    private herbivoreActionsService: HerbivoreActionsService;

    constructor(herbivoreActionsService: HerbivoreActionsService) {
        this.herbivoreActionsService = herbivoreActionsService;
    }

    /**
     * Action pour cueillir le dinosaure herbivore.
     */
    public grazeDinosaur = async (req: AuthenticatedRequest, res: Response) => {
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

            const { dinosaur: updatedDino, event } = await this.herbivoreActionsService.grazeDinosaur(dinosaur);

            const dinosaurDTO = plainToInstance(FrontendDinosaurDTO, updatedDino);
            res.status(200).json({ message: 'Action réussie', dinosaur: dinosaurDTO, event });
        } catch (error) {
            console.error('Erreur lors de l\'action cueillir du dinosaure:', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    };
}
