import { Response } from 'express';
import { AuthenticatedRequest } from '../../auth/middlewares/authMiddleware';
import { DinosaurDTO } from '../models/dinosaur.dto';
import { plainToInstance } from 'class-transformer';
import { HerbivoreActionsService } from '../services/herbivore-action.service';

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

            const dinosaur = await this.herbivoreActionsService.getDinosaurByUserId(userId);
            if (!dinosaur) {
                res.status(404).json({ message: 'Dinosaure non trouvé' });
                return;
            }

            const { dinosaur: updatedDino, event } = this.herbivoreActionsService.grazeDinosaur(dinosaur);

            await this.herbivoreActionsService.updateDinosaur(updatedDino);

            const dinosaurDTO = plainToInstance(DinosaurDTO, updatedDino);
            res.status(200).json({ message: 'Action réussie', dinosaur: dinosaurDTO, event });
        } catch (error) {
            console.error('Erreur lors de l\'action cueillir du dinosaure:', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    };
}
