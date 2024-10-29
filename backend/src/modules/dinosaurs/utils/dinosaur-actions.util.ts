import { Dinosaur } from '../models/dinosaur.interface';
import {
  ENERGY_COST_TO_EAT,
  ENERGY_COST_TO_GRAZE,
  ENERGY_COST_TO_HUNT,
  MAX_ENERGY_NO_SLEEP,
  MIN_ENERGY_TO_WAKE_UP,
} from '../../../common/config/constants';
import { DinosaurAction } from '../models/dinosaur-action.enum';
import { DinosaurActionDTO } from '../models/dinosaur-action.dto';
import { DinosaurActionsMap } from '../libs/dinosaur-actions.mapping';

export function canPerformAction(dinosaur: Dinosaur, action: DinosaurAction): boolean {
  if (dinosaur.isDead) {
    return action === DinosaurAction.Resurrect;
  }

  switch (action) {
    case DinosaurAction.Eat:
      return !dinosaur.isSleeping && dinosaur.energy >= ENERGY_COST_TO_EAT && dinosaur.food > 0 && dinosaur.hunger > 0;
    case DinosaurAction.Sleep:
      return !dinosaur.isSleeping && dinosaur.energy <= MAX_ENERGY_NO_SLEEP;
    case DinosaurAction.WakeUp:
      return dinosaur.isSleeping && dinosaur.energy >= MIN_ENERGY_TO_WAKE_UP;
    case DinosaurAction.Graze:
      return !dinosaur.isSleeping && dinosaur.energy >= ENERGY_COST_TO_GRAZE && dinosaur.diet !== 'carnivore';
    case DinosaurAction.Hunt:
      return !dinosaur.isSleeping && dinosaur.energy >= ENERGY_COST_TO_HUNT && dinosaur.diet !== 'herbivore';
    default:
      return false;
  }
}

/**
 * Récupère les actions disponibles pour un dinosaure, avec leurs détails pour le frontend.
 * @param dinosaur Dinosaure pour lequel récupérer les actions disponibles.
 * @returns Un tableau de DinosaurActionDTO.
 */
export function getAvailableActions(dinosaur: Dinosaur): DinosaurActionDTO[] {
  return Object.values(DinosaurActionsMap).map((actionDetails) => {
    const canPerform = actionDetails.canPerform(dinosaur);
    return new DinosaurActionDTO(
      actionDetails.name,
      actionDetails.description,
      canPerform,
      actionDetails.endpoint,
      actionDetails.image
    );
  });
}
