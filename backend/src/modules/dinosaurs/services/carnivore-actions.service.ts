import { Dinosaur } from '../models/dinosaur.interface';
import { DinosaurAction } from '../models/dinosaur-action.enum';
import { canPerformAction, applyEventToDinosaur } from '../utils/dinosaur-actions.util';
import { DinosaurEvent } from '../models/dinosaur-event.interface';
import { DinosaursService } from './dinosaurs.service';
import { DinosaurTimeService } from './dinosaur-time.service';

/**
 * Service pour gérer les actions spécifiques aux dinosaures carnivores (chasser).
 */
export class CarnivoreActionsService {
    private dinosaursService: DinosaursService;
    private dinosaurTimeService: DinosaurTimeService;

    constructor(dinosaursService: DinosaursService, dinosaurTimeService: DinosaurTimeService) {
        this.dinosaursService = dinosaursService;
        this.dinosaurTimeService = dinosaurTimeService;
    }

    /**
     * Récupère le dinosaure par ID utilisateur.
     * @param userId ID de l'utilisateur.
     * @returns Le dinosaure associé à l'utilisateur.
     */
    public async getDinosaurByUserId(userId: number): Promise<Dinosaur | null> {
        return await this.dinosaursService.getDinosaurByUserId(userId);
    }

    /**
     * Met à jour le dinosaure dans la base de données.
     * @param dinosaur Le dinosaure à mettre à jour.
     */
    public async updateDinosaur(dinosaur: Dinosaur): Promise<void> {
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
    }

    /**
     * Action pour chasser le dinosaure carnivore.
     * @param dinosaur Le dinosaure à chasser.
     * @returns Le dinosaure mis à jour et l'événement généré.
     */
    public huntDinosaur(dinosaur: Dinosaur): { dinosaur: Dinosaur, event: DinosaurEvent } {
        if (!canPerformAction(dinosaur, DinosaurAction.Hunt)) {
            throw new Error('Le dinosaure ne peut pas chasser.');
        }

        // Exemple d'événement de chasse réussi
        const event: DinosaurEvent = {
            name: 'Chasse réussie',
            description: 'Le dinosaure a chassé avec succès et a gagné de la nourriture.',
            minLevel: 1,
            experienceChange: 20,
            energyChange: -30,
            foodChange: 50,
            hungerChange: -30,
            karmaChange: 5,
            weight: 1,
        };

        applyEventToDinosaur(dinosaur, event);
        return { dinosaur, event };
    }
}
