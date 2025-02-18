import { Dinosaur } from '../models/backend-dinosaur.interface';
import { DinosaurAction } from '../models/dinosaur-action.enum';
import { getRandomEventForAction, applyEventToDinosaur } from '../utils/dinosaur-actions.util';
import { DinosaurEvent } from '../models/dinosaur-event.interface';
import { DinosaurActionsMap } from '../libs/dinosaur-actions.mapping';
import { DinosaurRepository } from '../repositories/dinosaur.repository';

/**
 * Service pour gérer les actions basiques du dinosaure (manger, dormir, se réveiller, ressusciter).
 */
export class BasicActionsService {
    private dinosaurRepository: DinosaurRepository;

    constructor(dinosaurRepository: DinosaurRepository) {
        this.dinosaurRepository = dinosaurRepository;
    }

    /**
     * Action pour manger le dinosaure.
     * @param dinosaur Le dinosaure à manger.
     * @returns Le dinosaure mis à jour et l'événement généré.
     */
    public eatDinosaur(dinosaur: Dinosaur): { dinosaur: Dinosaur, event: DinosaurEvent } {
        const actionDetails = DinosaurActionsMap[DinosaurAction.Eat];

        if (!actionDetails.canPerform(dinosaur)) {
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
        applyEventToDinosaur(dinosaur, DinosaurAction.Eat, event);

        this.dinosaurRepository.updateDinosaur(dinosaur.id, dinosaur);

        return { dinosaur, event };
    }

    /**
     * Action pour faire dormir le dinosaure.
     * @param dinosaur Le dinosaure à faire dormir.
     * @returns Le dinosaure mis à jour et l'événement généré.
     */
    public sleepDinosaur(dinosaur: Dinosaur): { dinosaur: Dinosaur, event: DinosaurEvent } {
        const actionDetails = DinosaurActionsMap[DinosaurAction.Sleep];

        if (!actionDetails.canPerform(dinosaur)) {
            throw new Error('Le dinosaure ne peut pas dormir.');
        }

        const event = getRandomEventForAction(DinosaurAction.Sleep, dinosaur.level);

        dinosaur.isSleeping = true;
        applyEventToDinosaur(dinosaur, DinosaurAction.Sleep, event);

        this.dinosaurRepository.updateDinosaur(dinosaur.id, dinosaur);
        return { dinosaur, event };
    }

    /**
     * Action pour réveiller le dinosaure.
     * @param dinosaur Le dinosaure à réveiller.
     * @returns Le dinosaure mis à jour et l'événement généré.
     */
    public wakeDinosaur(dinosaur: Dinosaur): { dinosaur: Dinosaur, event: DinosaurEvent } {
        const actionDetails = DinosaurActionsMap[DinosaurAction.WakeUp];

        if (!actionDetails.canPerform(dinosaur)) {
            throw new Error('Le dinosaure ne peut pas se réveiller.');
        }

        const event = getRandomEventForAction(DinosaurAction.WakeUp, dinosaur.level);

        dinosaur.isSleeping = false;
        applyEventToDinosaur(dinosaur, DinosaurAction.WakeUp, event);

        this.dinosaurRepository.updateDinosaur(dinosaur.id, dinosaur);
        return { dinosaur, event };
    }

    /**
     * Action pour ressusciter le dinosaure.
     * @param dinosaur Le dinosaure à ressusciter.
     * @returns Le dinosaure mis à jour et l'événement généré.
     */
    public resurrectDinosaur(dinosaur: Dinosaur): { dinosaur: Dinosaur, event: DinosaurEvent } {
        const actionDetails = DinosaurActionsMap[DinosaurAction.Resurrect];

        if (!actionDetails.canPerform(dinosaur)) {
            throw new Error('Le dinosaure ne peut pas ressusciter.');
        }

        const event = getRandomEventForAction(DinosaurAction.Resurrect, dinosaur.level);

        applyEventToDinosaur(dinosaur, DinosaurAction.Resurrect, event);

        this.dinosaurRepository.updateDinosaur(dinosaur.id, dinosaur);
        return { dinosaur, event };
    }

    /**
     * Action pour cueillir le dinosaure herbivore.
     * @param dinosaur Le dinosaure à cueillir.
     * @returns Le dinosaure mis à jour et l'événement généré.
     */
    public grazeDinosaur(dinosaur: Dinosaur): { dinosaur: Dinosaur, event: DinosaurEvent } {
        const actionDetails = DinosaurActionsMap[DinosaurAction.Graze];

        if (!actionDetails.canPerform(dinosaur)) {
            throw new Error('Le dinosaure ne peut pas brouter.');
        }

        const event = getRandomEventForAction(DinosaurAction.Graze, dinosaur.level);
        applyEventToDinosaur(dinosaur, DinosaurAction.Graze, event);

        this.dinosaurRepository.updateDinosaur(dinosaur.id, dinosaur);
        return { dinosaur, event };
    }
}
