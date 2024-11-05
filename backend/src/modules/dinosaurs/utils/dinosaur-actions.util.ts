import { Dinosaur } from '../models/dinosaur.interface';
import { DinosaurAction } from '../models/dinosaur-action.enum';
import { DinosaurEvent } from '../models/dinosaur-event.interface';
import { DinosaurActionsMap } from '../libs/dinosaur-actions.mapping';
import { DinosaurEventsMap } from '../libs/dinosaur-events.mapping';
import {
  BASE_EXP_REQUIRED,
  ENERGY_COST_TO_DISCOVER,
  ENERGY_COST_TO_GRAZE,
  ENERGY_COST_TO_HUNT,
  ENERGY_COST_TO_STEAL,
  EXP_GROWTH_FACTOR,
  LEVEL_MODIFIER,
  MAX_ENERGY_NO_SLEEP,
  MIN_ENERGY_TO_WAKE_UP,
} from '../../../common/config/constants';
import { DinosaurActionDTO } from '../models/dinosaur-action.dto';
import { DinosaurMultiplier } from '../models/dinosaur-multiplier.interface';
import { DinosaurFactory } from '../factories/dinosaur.factory';

/**
 * Détermine si une action peut être effectuée par le dinosaure en fonction de son état.
 */
export function canPerformAction(dinosaur: Dinosaur, action: DinosaurAction): boolean {

  // Vérifier si le dino est mort annuler, sauf si l'action est de le ressusciter
  if (dinosaur.isDead) {
    return action === DinosaurAction.Resurrect;
  }

  // Check si le dino a le niveau requis pour l'action
  if (dinosaur.level < DinosaurActionsMap[action].levelRequired) {
    return false;
  }

  switch (action) {
    case DinosaurAction.Eat:
      return !dinosaur.isSleeping && dinosaur.food > 0 && dinosaur.hunger > 0;
    case DinosaurAction.Sleep:
      return !dinosaur.isSleeping && dinosaur.energy <= MAX_ENERGY_NO_SLEEP;
    case DinosaurAction.WakeUp:
      return dinosaur.isSleeping && dinosaur.energy >= MIN_ENERGY_TO_WAKE_UP;
    case DinosaurAction.Graze:
      return !dinosaur.isSleeping && dinosaur.energy >= ENERGY_COST_TO_GRAZE && dinosaur.diet !== 'carnivore';
    case DinosaurAction.Hunt:
      return !dinosaur.isSleeping && dinosaur.energy >= ENERGY_COST_TO_HUNT && dinosaur.diet !== 'herbivore';
    case DinosaurAction.Discover:
      return !dinosaur.isSleeping && dinosaur.energy >= ENERGY_COST_TO_DISCOVER;
    case DinosaurAction.Steal:
      return !dinosaur.isSleeping && dinosaur.energy >= ENERGY_COST_TO_STEAL;
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
      actionDetails.levelRequired,
      canPerform,
      actionDetails.endpoint,
      actionDetails.image
    );
  });
}

/**
 * Sélectionne un événement aléatoire pour une action donnée, en tenant compte des poids
 * et du niveau du dinosaure.
 */
export function getRandomEventForAction(action: DinosaurAction, dinosaurLevel: number): DinosaurEvent {
  // Filtrer les événements selon le niveau du dinosaure
  const events = DinosaurEventsMap[action].filter(event => event.minLevel <= dinosaurLevel);

  if (events.length === 0) {
    throw new Error(`Aucun événement disponible pour l'action ${action} et le niveau ${dinosaurLevel}`);
  }

  // Calculer le poids total des événements disponibles
  const totalWeight = events.reduce((sum, event) => sum + event.weight, 0);

  // Sélectionner un poids aléatoire entre 0 et totalWeight
  let randomWeight = Math.random() * totalWeight;

  // Parcourir les événements pour sélectionner celui correspondant au poids aléatoire
  for (const event of events) {
    if (randomWeight < event.weight) {
      return event;
    }
    randomWeight -= event.weight;
  }

  // Retour de secours si aucun événement n'a été sélectionné
  return events[events.length - 1];
}

/**
 * Applique les effets d'un événement au dinosaure en modifiant ses statistiques et son niveau.
 * @param dinosaur Le dinosaure à mettre à jour.
 * @param action L'action effectuée.
 * @param event L'événement à appliquer.
 * @returns Le dinosaure mis à jour (nouvelle instance si ressuscité).
 */
export async function applyEventToDinosaur(
  dinosaur: Dinosaur,
  action: DinosaurAction,
  event: DinosaurEvent
): Promise<Dinosaur> {
  if (action === DinosaurAction.Resurrect) {
    // Utiliser la factory pour ressusciter le dinosaure
    return await DinosaurFactory.resurrectDinosaur(dinosaur, event);
  }

  let adjustedFoodChange = event.foodChange;
  let adjustedEnergyChange = event.energyChange;
  let adjustedHungerChange = event.hungerChange;
  let adjustedExperienceChange = event.experienceChange;
  let adjustedKarmaChange = event.karmaChange;

  // Utilisation des multiplicateurs du dinosaure
  const multipliers = dinosaur.multipliers;

  // Application des multiplicateurs spécifiques selon l'action
  switch (action) {
    case DinosaurAction.Graze:
      // Appliquer le multiplicateur global et spécifique herbivore si gain de nourriture
      if (adjustedFoodChange > 0) {
        adjustedFoodChange *= multipliers.earn_food_multiplier + multipliers.earn_herbi_food_multiplier - 1;
      }
      break;

    case DinosaurAction.Hunt:
      // Appliquer le multiplicateur global et spécifique carnivore si gain de nourriture
      if (adjustedFoodChange > 0) {
        adjustedFoodChange *= multipliers.earn_food_multiplier + multipliers.earn_carni_food_multiplier - 1;
      }
      break;
  }

  // Appliquer le multiplicateur d'expérience si le changement est positif
  if (adjustedExperienceChange > 0) {
    adjustedExperienceChange *= multipliers.earn_experience_multiplier;
  }

  // Appliquer le multiplicateur d'énergie uniquement si le changement est positif
  if (adjustedEnergyChange > 0) {
    adjustedEnergyChange *= multipliers.earn_energy_multiplier;
  }

  // Appliquer les changements ajustés
  dinosaur.food = Math.min(dinosaur.food + adjustedFoodChange, dinosaur.max_food * multipliers.max_food_multiplier);
  dinosaur.energy = Math.max(dinosaur.energy + adjustedEnergyChange, 0);
  dinosaur.hunger = Math.max(dinosaur.hunger + adjustedHungerChange, 0);
  dinosaur.karma += adjustedKarmaChange;

  dinosaur.experience += adjustedExperienceChange;

  if (event.typeChange) {
    dinosaur.type = event.typeChange;
  }

  // Gestion de la montée de niveau en fonction du seuil d'expérience dynamique
  let experienceThreshold = getExperienceThresholdForLevel(dinosaur.level + 1);

  while (dinosaur.experience >= experienceThreshold) {
    dinosaur.level += 1;
    dinosaur.experience -= experienceThreshold;
    experienceThreshold = getExperienceThresholdForLevel(dinosaur.level + 1);
  }

  return dinosaur;
}

/**
 * Calcul le seuil d'expérience nécessaire pour atteindre un niveau donné.
 * @param level Niveau du dinosaure pour lequel on veut calculer le seuil d'expérience.
 * @returns Le seuil d'expérience pour le niveau donné.
 */
export function getExperienceThresholdForLevel(level: number): number {
  return Math.floor(BASE_EXP_REQUIRED * Math.pow(level, EXP_GROWTH_FACTOR) * LEVEL_MODIFIER);
}
