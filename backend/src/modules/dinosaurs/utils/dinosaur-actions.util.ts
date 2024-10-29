import { Dinosaur } from '../models/dinosaur.interface';
import { DinosaurAction } from '../models/dinosaur-action.enum';
import { DinosaurEvent } from '../models/dinosaur-event.interface';
import { DinosaurActionsMap } from '../libs/dinosaur-actions.mapping';
import { DinosaurEventsMap } from '../libs/dinosaur-events.mapping';
import {
  ENERGY_COST_TO_EAT,
  ENERGY_COST_TO_GRAZE,
  ENERGY_COST_TO_HUNT,
  MAX_ENERGY_NO_SLEEP,
  MIN_ENERGY_TO_WAKE_UP,
} from '../../../common/config/constants';
import { DinosaurActionDTO } from '../models/dinosaur-action.dto';

/**
 * Détermine si une action peut être effectuée par le dinosaure en fonction de son état.
 */
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
 */
export function getAvailableActions(dinosaur: Dinosaur) {
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

/**
 * Sélectionne un événement aléatoire pour une action donnée en tenant compte des poids.
 */
export function getRandomEventForAction(action: DinosaurAction): DinosaurEvent {
  const events = DinosaurEventsMap[action];
  const totalWeight = events.reduce((sum, event) => sum + event.weight, 0);
  let randomWeight = Math.random() * totalWeight;

  for (const event of events) {
    if (randomWeight < event.weight) {
      return event;
    }
    randomWeight -= event.weight;
  }
  return events[0]; // En cas d'erreur, retourne le premier événement comme secours
}

/**
 * Applique les effets d'un événement au dinosaure en modifiant ses statistiques.
 */
export function applyEventToDinosaur(dinosaur: Dinosaur, event: DinosaurEvent): void {
  dinosaur.food = Math.min(dinosaur.food + event.foodChange, dinosaur.max_food);
  dinosaur.energy = Math.max(dinosaur.energy + event.energyChange, 0);
  dinosaur.hunger = Math.max(dinosaur.hunger + event.hungerChange, 0);
}
