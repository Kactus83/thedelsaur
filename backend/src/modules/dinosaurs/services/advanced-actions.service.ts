import { Dinosaur } from '../models/dinosaur.interface';
import { DinosaurAction } from '../models/dinosaur-action.enum';
import { getRandomEventForAction, applyEventToDinosaur } from '../utils/dinosaur-actions.util';
import { DinosaurEvent } from '../models/dinosaur-event.interface';
import { DinosaursService } from './dinosaurs.service';
import { DinosaurActionsMap } from '../libs/dinosaur-actions.mapping';
import { DinosaurRepository } from '../repositories/dinosaur.repository';

/**
 * Service pour gérer les actions avancées du dinosaure (voler, découvrir).
 */
export class AdvancedActionsService {
    private dinosaurRepository: DinosaurRepository;

    constructor(dinosaurRepository: DinosaurRepository) {
        this.dinosaurRepository = dinosaurRepository;
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

        this.dinosaurRepository.updateDinosaur(dinosaur.id, dinosaur);

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

        this.dinosaurRepository.updateDinosaur(dinosaur.id, dinosaur);

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

        this.dinosaurRepository.updateDinosaur(dinosaur.id, dinosaur);
        
        return { dinosaur, event };
    }
}
