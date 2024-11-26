import { Dinosaur } from '../models/dinosaur.interface';
import { DinosaurAction } from '../models/dinosaur-action.enum';
import { getRandomEventForAction, applyEventToDinosaur } from '../utils/dinosaur-actions.util';
import { DinosaurEvent } from '../models/dinosaur-event.interface';
import { DinosaursService } from './dinosaurs.service';
import { DinosaurActionsMap } from '../libs/dinosaur-actions.mapping';

/**
 * Service pour gérer les actions avancées du dinosaure (voler, découvrir).
 */
export class AdvancedActionsService {
    private dinosaursService: DinosaursService;

    constructor(dinosaursService: DinosaursService) {
        this.dinosaursService = dinosaursService;
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
     * Action pour voler le dinosaure.
     * @param dinosaur Le dinosaure à voler.
     * @returns Le dinosaure mis à jour et l'événement généré.
     */
    public stealDinosaur(dinosaur: Dinosaur): { dinosaur: Dinosaur, event: DinosaurEvent } {
        const actionDetails = DinosaurActionsMap[DinosaurAction.Steal];

        if (!actionDetails.canPerform(dinosaur)) {
            throw new Error('Le dinosaure ne peut pas voler.');
        }

        const event = getRandomEventForAction(DinosaurAction.Steal, dinosaur.level);
        applyEventToDinosaur(dinosaur, DinosaurAction.Steal, event);
        return { dinosaur, event };
    }

    /**
     * Action pour découvrir le dinosaure.
     * @param dinosaur Le dinosaure à découvrir.
     * @returns Le dinosaure mis à jour et l'événement généré.
     */
    public discoverDinosaur(dinosaur: Dinosaur): { dinosaur: Dinosaur, event: DinosaurEvent } {
        const actionDetails = DinosaurActionsMap[DinosaurAction.Discover];

        if (!actionDetails.canPerform(dinosaur)) {
            throw new Error('Le dinosaure ne peut pas découvrir.');
        }

        const event = getRandomEventForAction(DinosaurAction.Discover, dinosaur.level);
        applyEventToDinosaur(dinosaur, DinosaurAction.Discover, event);
        return { dinosaur, event };
    }

    /**
     * Action pour fair eprier le dinosaure
     * @param dinosaur Le dinosaure à écrire.
     * @returns Le dinosaure mis à jour et l'événement généré.
     */
    public prayDinosaur(dinosaur: Dinosaur): { dinosaur: Dinosaur, event: DinosaurEvent } {
        const actionDetails = DinosaurActionsMap[DinosaurAction.Pray];

        if (!actionDetails.canPerform(dinosaur)) {
            throw new Error('Le dinosaure ne peut pas prier.');
        }

        const event = getRandomEventForAction(DinosaurAction.Pray, dinosaur.level);
        applyEventToDinosaur(dinosaur, DinosaurAction.Pray, event);
        return { dinosaur, event };
    }
}
