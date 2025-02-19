import { DinosaurAction } from '../models/dinosaur-action.enum';
import { getRandomEventForAction, applyEventToDinosaur } from '../utils/dinosaur-actions.util';
import { DinosaurEvent } from '../models/dinosaur-event.interface';
import { DinosaurActionsMap } from '../libs/dinosaur-actions.mapping';
import { DinosaurRepository } from '../repositories/dinosaur.repository';
import { FrontendDinosaurDTO } from '../models/frontend-dinosaur.dto';

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
    public async stealDinosaur(dinosaur: FrontendDinosaurDTO): Promise<{ dinosaur: FrontendDinosaurDTO, event: DinosaurEvent }> {
        const actionDetails = DinosaurActionsMap[DinosaurAction.Steal];

        if (!actionDetails.canPerform(dinosaur)) {
            throw new Error('Le dinosaure ne peut pas voler.');
        }

        const event = await getRandomEventForAction(DinosaurAction.Steal, dinosaur.level);
        applyEventToDinosaur(dinosaur, DinosaurAction.Steal, event);

        this.dinosaurRepository.updateDinosaur(dinosaur.id, dinosaur);

        return { dinosaur, event };
    }

    /**
     * Action pour découvrir le dinosaure.
     * @param dinosaur Le dinosaure à découvrir.
     * @returns Le dinosaure mis à jour et l'événement généré.
     */
    public async discoverDinosaur(dinosaur: FrontendDinosaurDTO): Promise<{ dinosaur: FrontendDinosaurDTO, event: DinosaurEvent }> {
        const actionDetails = DinosaurActionsMap[DinosaurAction.Discover];

        if (!actionDetails.canPerform(dinosaur)) {
            throw new Error('Le dinosaure ne peut pas découvrir.');
        }

        const event = await getRandomEventForAction(DinosaurAction.Discover, dinosaur.level);
        applyEventToDinosaur(dinosaur, DinosaurAction.Discover, event);

        this.dinosaurRepository.updateDinosaur(dinosaur.id, dinosaur);

        return { dinosaur, event };
    }

    /**
     * Action pour fair eprier le dinosaure
     * @param dinosaur Le dinosaure à écrire.
     * @returns Le dinosaure mis à jour et l'événement généré.
     */
    public async prayDinosaur(dinosaur: FrontendDinosaurDTO): Promise<{ dinosaur: FrontendDinosaurDTO, event: DinosaurEvent }> {
        const actionDetails = DinosaurActionsMap[DinosaurAction.Pray];

        if (!actionDetails.canPerform(dinosaur)) {
            throw new Error('Le dinosaure ne peut pas prier.');
        }

        const event = await getRandomEventForAction(DinosaurAction.Pray, dinosaur.level);
        applyEventToDinosaur(dinosaur, DinosaurAction.Pray, event);

        this.dinosaurRepository.updateDinosaur(dinosaur.id, dinosaur);
        
        return { dinosaur, event };
    }

    /**
     * Action pour que le dinosaure aille travailler en tant que garde du corps.
     * @param dinosaur Le dinosaure qui vatravailler
     * @returns Le dinosaure mis à jour et l'événement généré.
     */
    public async bodyguardDinosaur(dinosaur: FrontendDinosaurDTO): Promise<{ dinosaur: FrontendDinosaurDTO, event: DinosaurEvent }> {
        const actionDetails = DinosaurActionsMap[DinosaurAction.Bodyguard];

        if (!actionDetails.canPerform(dinosaur)) {
            throw new Error('Le dinosaure ne peut pas travailler comme garde du corps.');
        }

        const event = await getRandomEventForAction(DinosaurAction.Bodyguard, dinosaur.level);
        applyEventToDinosaur(dinosaur, DinosaurAction.Bodyguard, event);

        this.dinosaurRepository.updateDinosaur(dinosaur.id, dinosaur);

        return { dinosaur, event };
    }

    /**
     * Action pour que le dinosaure garde les enfants d'un autre dinosaure.
     * @param dinosaur Le dinosaure qui va garder les enfants.
     * @returns Le dinosaure mis à jour et l'événement généré.
     */
    public async babysitterDinosaur(dinosaur: FrontendDinosaurDTO): Promise<{ dinosaur: FrontendDinosaurDTO, event: DinosaurEvent }> {
        const actionDetails = DinosaurActionsMap[DinosaurAction.Babysitter];

        if (!actionDetails.canPerform(dinosaur)) {
            throw new Error('Le dinosaure ne peut pas garder les enfants.');
        }

        const event = await getRandomEventForAction(DinosaurAction.Babysitter, dinosaur.level);
        applyEventToDinosaur(dinosaur, DinosaurAction.Babysitter, event);

        this.dinosaurRepository.updateDinosaur(dinosaur.id, dinosaur);

        return { dinosaur, event };
    }
}
