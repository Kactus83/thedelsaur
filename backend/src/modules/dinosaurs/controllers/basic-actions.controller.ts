import { Response } from 'express';
import { AuthenticatedRequest } from '../../auth/middlewares/authMiddleware';
import { DinosaurDTO } from '../models/dinosaur.dto';
import { plainToInstance } from 'class-transformer';
import { BasicActionsService } from '../services/basic-actions.service';

/**
 * Contrôleur pour les actions basiques du dinosaure (manger, dormir, se réveiller, ressusciter).
 */
export class BasicActionsController {
    private basicActionsService: BasicActionsService;

    constructor(basicActionsService: BasicActionsService) {
        this.basicActionsService = basicActionsService;
    }

    /**
     * Action pour manger le dinosaure.
     */
    public eatDinosaur = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(400).json({ message: 'Utilisateur non authentifié' });
                return;
            }

            const dinosaur = await this.basicActionsService.getDinosaurByUserId(userId);
            if (!dinosaur) {
                res.status(404).json({ message: 'Dinosaure non trouvé' });
                return;
            }

            const { dinosaur: updatedDino, event } = this.basicActionsService.eatDinosaur(dinosaur);

            await this.basicActionsService.updateDinosaur(updatedDino);

            const dinosaurDTO = plainToInstance(DinosaurDTO, updatedDino);
            res.status(200).json({ message: 'Action réussie', dinosaur: dinosaurDTO, event });
        } catch (error) {
            console.error('Erreur lors de l\'action manger du dinosaure:', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    };

    /**
     * Action pour faire dormir le dinosaure.
     */
    public sleepDinosaur = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(400).json({ message: 'Utilisateur non authentifié' });
                return;
            }

            const dinosaur = await this.basicActionsService.getDinosaurByUserId(userId);
            if (!dinosaur) {
                res.status(404).json({ message: 'Dinosaure non trouvé' });
                return;
            }

            const { dinosaur: updatedDino, event } = this.basicActionsService.sleepDinosaur(dinosaur);

            await this.basicActionsService.updateDinosaur(updatedDino);

            const dinosaurDTO = plainToInstance(DinosaurDTO, updatedDino);
            res.status(200).json({ message: 'Le dinosaure est maintenant en sommeil.', dinosaur: dinosaurDTO, event });
        } catch (error) {
            console.error('Erreur lors de l\'action dormir du dinosaure:', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    };

    /**
     * Action pour réveiller le dinosaure.
     */
    public wakeDinosaur = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(400).json({ message: 'Utilisateur non authentifié' });
                return;
            }

            const dinosaur = await this.basicActionsService.getDinosaurByUserId(userId);
            if (!dinosaur) {
                res.status(404).json({ message: 'Dinosaure non trouvé' });
                return;
            }

            const { dinosaur: updatedDino, event } = this.basicActionsService.wakeDinosaur(dinosaur);

            await this.basicActionsService.updateDinosaur(updatedDino);

            const dinosaurDTO = plainToInstance(DinosaurDTO, updatedDino);
            res.status(200).json({ message: 'Le dinosaure s\'est réveillé.', dinosaur: dinosaurDTO, event });
        } catch (error) {
            console.error('Erreur lors de l\'action réveiller du dinosaure:', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    };

    /**
     * Action pour ressusciter le dinosaure.
     */
    public resurrectDinosaur = async (req: AuthenticatedRequest, res: Response) => {
        try {
            const userId = req.user?.id;
            if (!userId) {
                res.status(400).json({ message: 'Utilisateur non authentifié' });
                return;
            }

            const dinosaur = await this.basicActionsService.getDinosaurByUserId(userId);
            if (!dinosaur) {
                res.status(404).json({ message: 'Dinosaure non trouvé' });
                return;
            }

            if (!dinosaur.isDead) {
                res.status(400).json({ message: 'Le dinosaure n\'est pas mort.' });
                return;
            }

            const { dinosaur: updatedDino, event } = this.basicActionsService.resurrectDinosaur(dinosaur);

            await this.basicActionsService.updateDinosaur(updatedDino);

            const dinosaurDTO = plainToInstance(DinosaurDTO, updatedDino);
            res.status(200).json({ message: 'Le dinosaure a été ressuscité.', dinosaur: dinosaurDTO, event });
        } catch (error) {
            console.error('Erreur lors de l\'action ressusciter du dinosaure:', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    };
}
