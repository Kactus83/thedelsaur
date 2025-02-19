import { DinosaurAction } from '../models/dinosaur-action.enum';
import { DinosaurEvent } from '../models/dinosaur-event.interface';
import { DinosaurActionsMap } from '../libs/dinosaur-actions.mapping';
import { DinosaurEventsMap } from '../libs/dinosaur-events.mapping';
import {
  BASE_EXP_REQUIRED,
  EXP_GROWTH_FACTOR,
  LEVEL_MODIFIER,
} from '../../../common/config/constants';
import { DinosaurActionDTO } from '../models/dinosaur-action.dto';
import { DinosaurFactory } from '../factories/dinosaur.factory';
import { FrontendDinosaurDTO } from '../models/frontend-dinosaur.dto';

/**
 * Retourne la liste des actions disponibles pour le dinosaure,
 * chaque action étant encapsulée dans un DinosaurActionDTO.
 */
export function getAvailableActions(dinosaur: FrontendDinosaurDTO): DinosaurActionDTO[] {
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
 * Sélectionne aléatoirement un événement pour une action donnée, en tenant compte du niveau du dinosaure.
 * @param action L'action effectuée.
 * @param dinosaurLevel Le niveau du dinosaure.
 * @returns L'événement sélectionné.
 */
export function getRandomEventForAction(action: DinosaurAction, dinosaurLevel: number): DinosaurEvent {
  const events = DinosaurEventsMap[action].filter(event => event.minLevel <= dinosaurLevel);
  if (events.length === 0) {
    throw new Error(`Aucun événement disponible pour l'action ${action} et le niveau ${dinosaurLevel}`);
  }
  const totalWeight = events.reduce((sum, event) => sum + event.weight, 0);
  let randomWeight = Math.random() * totalWeight;
  for (const event of events) {
    if (randomWeight < event.weight) {
      return event;
    }
    randomWeight -= event.weight;
  }
  return events[events.length - 1];
}

/**
 * Applique les effets d'un événement au dinosaure en modifiant ses statistiques.
 * Pour l'action "Resurrect", la fonction délègue à la fonction de résurrection de la factory.
 * Pour les autres actions, les ajustements sont appliqués en utilisant les multiplicateurs finaux présents dans le DTO.
 * 
 * @param dinosaur Le dinosaure (FrontendDinosaurDTO) à mettre à jour.
 * @param action L'action effectuée.
 * @param event L'événement à appliquer.
 * @returns Le dinosaure mis à jour.
 */
export async function applyEventToDinosaur(
  dinosaur: FrontendDinosaurDTO,
  action: DinosaurAction,
  event: DinosaurEvent
): Promise<FrontendDinosaurDTO> {

  // Pour l'action de résurrection, déléguer à la factory avec 2 arguments
  if (action === DinosaurAction.Resurrect) {
    return await DinosaurFactory.resurrectDinosaur(dinosaur, event);
  }

  // Initialiser les ajustements
  let adjustedFoodChange = event.foodChange;
  let adjustedEnergyChange = event.energyChange;
  let adjustedHungerChange = event.hungerChange;
  let adjustedExperienceChange = event.experienceChange;
  let adjustedKarmaChange = event.karmaChange;
  const adjustedMoneyChange = event.moneyChange;
  const adjustedSkillPointsChange = event.skillPointsChange;

  // Ajustements spécifiques pour Graze et Hunt
  switch (action) {
    case DinosaurAction.Graze:
      if (adjustedFoodChange > 0) {
        adjustedFoodChange *= (dinosaur.final_earn_food_global_multiplier + dinosaur.final_earn_food_herbi_multiplier - 1);
      }
      break;
    case DinosaurAction.Hunt:
      if (adjustedFoodChange > 0) {
        adjustedFoodChange *= (dinosaur.final_earn_food_global_multiplier + dinosaur.final_earn_food_carni_multiplier - 1);
      }
      break;
    // Autres cas spécifiques...
  }

  // Appliquer les multiplicateurs pour l'expérience (et éventuellement money/skill_points si besoin)
  if (adjustedExperienceChange > 0) {
    adjustedExperienceChange *= dinosaur.final_earn_experience_multiplier;
  }
  // Pour l'énergie, aucun multiplicateur spécifique n'est défini dans le DTO
  // donc nous utilisons le changement tel quel.

  // Mise à jour des statistiques, en respectant les bornes finales
  dinosaur.food = Math.min(dinosaur.food + adjustedFoodChange, dinosaur.final_max_food);
  dinosaur.energy = Math.max(dinosaur.energy + adjustedEnergyChange, 0);
  dinosaur.hunger = Math.max(dinosaur.hunger + adjustedHungerChange, 0);
  dinosaur.karma += adjustedKarmaChange;
  dinosaur.experience += adjustedExperienceChange;
  dinosaur.money += adjustedMoneyChange;
  dinosaur.skill_points += adjustedSkillPointsChange;

  // Si l'événement spécifie un changement de type, l'appliquer (en s'assurant que ce n'est pas undefined)
  if (event.typeChange !== undefined) {
    dinosaur.type = event.typeChange;
  }

  // Gestion de la montée de niveau
  let experienceThreshold = getExperienceThresholdForLevel(dinosaur.level + 1);
  while (dinosaur.experience >= experienceThreshold) {
    dinosaur.level += 1;
    dinosaur.experience -= experienceThreshold;
    experienceThreshold = getExperienceThresholdForLevel(dinosaur.level + 1);
  }

  // Plafonner le karma selon la propriété karma_width
  dinosaur.karma = Math.max(-dinosaur.karma_width, Math.min(dinosaur.karma, dinosaur.karma_width));

  return dinosaur;
}

/**
 * Calcule le seuil d'expérience nécessaire pour atteindre un niveau donné.
 * @param level Le niveau pour lequel on calcule le seuil.
 * @returns Le seuil d'expérience requis.
 */
export function getExperienceThresholdForLevel(level: number): number {
  return Math.floor(BASE_EXP_REQUIRED * Math.pow(level, EXP_GROWTH_FACTOR) * LEVEL_MODIFIER);
}
