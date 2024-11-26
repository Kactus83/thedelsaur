import { Dinosaur } from '../models/dinosaur.interface';
import { DinosaurAction } from '../models/dinosaur-action.enum';
import { getRandomEventForAction, applyEventToDinosaur } from '../utils/dinosaur-actions.util';
import { DinosaurEvent } from '../models/dinosaur-event.interface';
import { DinosaursService } from './dinosaurs.service';
import { DinosaurActionsMap } from '../libs/dinosaur-actions.mapping';
import { DinosaurRepository } from '../repositories/dinosaur.repository';

/**
 * Service pour gérer les actions spécifiques aux dinosaures carnivores (chasser).
 */
export class CarnivoreActionsService {
    private dinosaurRepository: DinosaurRepository;

    constructor(dinosaurRepository: DinosaurRepository) {
        this.dinosaurRepository = dinosaurRepository;
    }

    /**
     * Action pour chasser le dinosaure carnivore.
     * @param dinosaur Le dinosaure à chasser.
     * @returns Le dinosaure mis à jour et l'événement généré.
     */
    public huntDinosaur(dinosaur: Dinosaur): { dinosaur: Dinosaur, event: DinosaurEvent } {
        const actionDetails = DinosaurActionsMap[DinosaurAction.Hunt];

        if (!actionDetails.canPerform(dinosaur)) {
            throw new Error('Le dinosaure ne peut pas chasser.');
        }

        const event = getRandomEventForAction(DinosaurAction.Hunt, dinosaur.level);
        applyEventToDinosaur(dinosaur, DinosaurAction.Hunt, event);

        this.dinosaurRepository.updateDinosaur(dinosaur.id, dinosaur);

        return { dinosaur, event };
    }
}
