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

    /**
     * Action pour quele dinosaure travaille comme garde du corps
     */
    public bodyguardDinosaur = async (req: AuthenticatedRequest, res: Response) => {
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

            const { dinosaur: updatedDino, event } = await this.advancedActionsService.bodyguardDinosaur(dinosaur);

            const dinosaurDTO = plainToInstance(FrontendDinosaurDTO, updatedDino);
            res.status(200).json({ message: 'Action réussie', dinosaur: dinosaurDTO, event });
        } catch (error) {
            console.error('Erreur lors de l\'action garder du dinosaure:', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    }

    /**
     * Action pour que le dinosaure travaille comme garde d'enfants
     */
    public babysitterDinosaur = async (req: AuthenticatedRequest, res: Response) => {
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

            const { dinosaur: updatedDino, event } = await this.advancedActionsService.babysitterDinosaur(dinosaur);

            const dinosaurDTO = plainToInstance(FrontendDinosaurDTO, updatedDino);
            res.status(200).json({ message: 'Action réussie', dinosaur: dinosaurDTO, event });
        } catch (error) {
            console.error('Erreur lors de l\'action garder du dinosaure:', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    }

    /**
     * Action pour que le dinosaure plonge
     */
    public diveDinosaur = async (req: AuthenticatedRequest, res: Response) => {
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

            const { dinosaur: updatedDino, event } = await this.advancedActionsService.diveDinosaur(dinosaur);

            const dinosaurDTO = plainToInstance(FrontendDinosaurDTO, updatedDino);
            res.status(200).json({ message: 'Action réussie', dinosaur: dinosaurDTO, event });
        } catch (error) {
            console.error('Erreur lors de l\'action plonger du dinosaure:', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    }

    /**
     * Action pour que le dinosaure creuse
     */
    public digDinosaur = async (req: AuthenticatedRequest, res: Response) => {
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

            const { dinosaur: updatedDino, event } = await this.advancedActionsService.digDinosaur(dinosaur);

            const dinosaurDTO = plainToInstance(FrontendDinosaurDTO, updatedDino);
            res.status(200).json({ message: 'Action réussie', dinosaur: dinosaurDTO, event });
        } catch (error) {
            console.error('Erreur lors de l\'action creuser du dinosaure:', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    }

    /**
     * Action pour que le dinosaure vole
     */
    public flyDinosaur = async (req: AuthenticatedRequest, res: Response) => {
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

            const { dinosaur: updatedDino, event } = await this.advancedActionsService.flyDinosaur(dinosaur);

            const dinosaurDTO = plainToInstance(FrontendDinosaurDTO, updatedDino);
            res.status(200).json({ message: 'Action réussie', dinosaur: dinosaurDTO, event });
        } catch (error) {
            console.error('Erreur lors de l\'action voler du dinosaure:', error);
            res.status(500).json({ message: 'Erreur interne du serveur' });
        }
    }

}
