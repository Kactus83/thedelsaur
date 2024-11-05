import { Dinosaur } from '../models/dinosaur.interface';
import { DinosaurAction } from '../models/dinosaur-action.enum';
import { canPerformAction, getRandomEventForAction, applyEventToDinosaur } from '../utils/dinosaur-actions.util';
import { DinosaurEvent } from '../models/dinosaur-event.interface';
import { KARMA_GAIN_AFTER_DEATH, BASE_ENERGY, BASE_FOOD } from '../../../common/config/constants';
import { getRandomDiet } from '../../auth/utils/dinosaurs.util';
import { formatDateForMySQL } from '../../../common/utils/dateUtils';
import { DinosaursService } from '../services/dinosaurs.service';

/**
 * Service pour gérer les actions basiques du dinosaure (manger, dormir, se réveiller, ressusciter).
 */
export class BasicActionsService {
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
     * Action pour manger le dinosaure.
     * @param dinosaur Le dinosaure à manger.
     * @returns Le dinosaure mis à jour et l'événement généré.
     */
    public eatDinosaur(dinosaur: Dinosaur): { dinosaur: Dinosaur, event: DinosaurEvent } {
        if (!canPerformAction(dinosaur, DinosaurAction.Eat)) {
            throw new Error('Le dinosaure ne peut pas manger.');
        }

        // Calcule la quantité de nourriture à consommer pour réduire la faim autant que possible
        const foodNeeded = Math.min(dinosaur.hunger, dinosaur.food);

        // Si aucune nourriture n'est disponible ou aucune faim n'est présente, renvoie un événement indiquant l'échec
        if (foodNeeded <= 0) {
            return {
                dinosaur,
                event: {
                    name: 'Pas de nourriture suffisante',
                    description: 'Le dinosaure n\'a pas assez de nourriture pour satisfaire sa faim.',
                    minLevel: 0,
                    experienceChange: 0,
                    energyChange: 0,
                    foodChange: 0,
                    hungerChange: 0,
                    karmaChange: 0,
                    weight: 1,
                },
            };
        }

        // Crée l'événement basé sur la consommation réelle de nourriture
        const event: DinosaurEvent = {
            name: 'Repas optimisé',
            description: 'Le dinosaure utilise la nourriture disponible pour réduire sa faim.',
            minLevel: 0,
            experienceChange: 0,
            energyChange: 0,
            foodChange: -foodNeeded,  // Consomme la quantité calculée de nourriture
            hungerChange: -foodNeeded, // Réduit la faim par la même quantité
            karmaChange: 0,
            weight: 1,
        };

        // Applique l'événement au dinosaure
        applyEventToDinosaur(dinosaur, event);
        return { dinosaur, event };
    }

    /**
     * Action pour faire dormir le dinosaure.
     * @param dinosaur Le dinosaure à faire dormir.
     * @returns Le dinosaure mis à jour et l'événement généré.
     */
    public sleepDinosaur(dinosaur: Dinosaur): { dinosaur: Dinosaur, event: DinosaurEvent } {
        if (!canPerformAction(dinosaur, DinosaurAction.Sleep)) {
            throw new Error('Le dinosaure ne peut pas dormir.');
        }

        const event = getRandomEventForAction(DinosaurAction.Sleep, dinosaur.level);

        dinosaur.isSleeping = true;
        applyEventToDinosaur(dinosaur, event);
        return { dinosaur, event };
    }

    /**
     * Action pour réveiller le dinosaure.
     * @param dinosaur Le dinosaure à réveiller.
     * @returns Le dinosaure mis à jour et l'événement généré.
     */
    public wakeDinosaur(dinosaur: Dinosaur): { dinosaur: Dinosaur, event: DinosaurEvent } {
        if (!canPerformAction(dinosaur, DinosaurAction.WakeUp)) {
            throw new Error('Le dinosaure ne peut pas se réveiller.');
        }

        const event = getRandomEventForAction(DinosaurAction.WakeUp, dinosaur.level);

        dinosaur.isSleeping = false;
        applyEventToDinosaur(dinosaur, event);
        return { dinosaur, event };
    }

    /**
     * Action pour ressusciter le dinosaure.
     * @param dinosaur Le dinosaure à ressusciter.
     * @returns Le dinosaure mis à jour et l'événement généré.
     */
    public resurrectDinosaur(dinosaur: Dinosaur): { dinosaur: Dinosaur, event: DinosaurEvent } {
        if (!canPerformAction(dinosaur, DinosaurAction.Resurrect)) {
            throw new Error('Le dinosaure ne peut pas être ressuscité.');
        }

        const event = getRandomEventForAction(DinosaurAction.Resurrect, dinosaur.level);

        dinosaur.isDead = false;
        dinosaur.diet = getRandomDiet();
        dinosaur.isSleeping = false;
        dinosaur.energy = BASE_ENERGY;
        dinosaur.food = BASE_FOOD;
        dinosaur.hunger = 0;
        dinosaur.last_reborn = formatDateForMySQL(new Date());
        dinosaur.experience = 0;
        dinosaur.level = 1;
        dinosaur.reborn_amount += 1;
        dinosaur.karma += KARMA_GAIN_AFTER_DEATH;

        applyEventToDinosaur(dinosaur, event);
        return { dinosaur, event };
    }

    /**
     * Action pour cueillir le dinosaure herbivore.
     * @param dinosaur Le dinosaure à cueillir.
     * @returns Le dinosaure mis à jour et l'événement généré.
     */
    public grazeDinosaur(dinosaur: Dinosaur): { dinosaur: Dinosaur, event: DinosaurEvent } {
        if (!canPerformAction(dinosaur, DinosaurAction.Graze)) {
            throw new Error('Le dinosaure ne peut pas cueillir.');
        }

        const event = getRandomEventForAction(DinosaurAction.Graze, dinosaur.level);
        applyEventToDinosaur(dinosaur, event);
        return { dinosaur, event };
    }
}
