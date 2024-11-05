import { Dinosaur } from '../models/dinosaur.interface';
import { DinosaurAction } from '../models/dinosaur-action.enum';
import { canPerformAction, applyEventToDinosaur } from '../utils/dinosaur-actions.util';
import { DinosaurEvent } from '../models/dinosaur-event.interface';
import { DinosaursService } from './dinosaurs.service';
import { DinosaurTimeService } from './dinosaur-time.service';

/**
 * Service pour gérer les actions avancées du dinosaure (voler, découvrir).
 */
export class AdvancedActionsService {
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
     * Action pour voler le dinosaure.
     * @param dinosaur Le dinosaure à voler.
     * @returns Le dinosaure mis à jour et l'événement généré.
     */
    public stealDinosaur(dinosaur: Dinosaur): { dinosaur: Dinosaur, event: DinosaurEvent } {
        if (!canPerformAction(dinosaur, DinosaurAction.Steal)) {
            throw new Error('Le dinosaure ne peut pas voler.');
        }

        // Exemple d'événement de vol réussi
        const event: DinosaurEvent = {
            name: 'Vol réussi',
            description: 'Le dinosaure a volé avec succès.',
            minLevel: 2,
            experienceChange: 25,
            energyChange: -40,
            foodChange: 0,
            hungerChange: 10,
            karmaChange: -5,
            weight: 1,
        };

        applyEventToDinosaur(dinosaur, event);
        return { dinosaur, event };
    }

    /**
     * Action pour découvrir le dinosaure.
     * @param dinosaur Le dinosaure à découvrir.
     * @returns Le dinosaure mis à jour et l'événement généré.
     */
    public discoverDinosaur(dinosaur: Dinosaur): { dinosaur: Dinosaur, event: DinosaurEvent } {
        if (!canPerformAction(dinosaur, DinosaurAction.Discover)) {
            throw new Error('Le dinosaure ne peut pas découvrir.');
        }

        // Exemple d'événement de découverte réussi
        const event: DinosaurEvent = {
            name: 'Découverte réussie',
            description: 'Le dinosaure a découvert de nouvelles terres.',
            minLevel: 3,
            experienceChange: 30,
            energyChange: -50,
            foodChange: 0,
            hungerChange: 15,
            karmaChange: 10,
            weight: 1,
        };

        applyEventToDinosaur(dinosaur, event);
        return { dinosaur, event };
    }
}
