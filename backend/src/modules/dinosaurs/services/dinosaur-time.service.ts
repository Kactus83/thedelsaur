import { Dinosaur } from '../models/dinosaur.interface';
import {
  ENERGY_DECAY_RATE_PER_SECOND,
  ENERGY_RECOVERY_RATE_PER_SECOND,
  HUNGER_INCREASE_PER_SECOND,
  HUNGER_INCREASE_PER_SECOND_WHILE_SLEEPING,
  HUNGER_ENERGY_LOSS_RATE_PER_SECOND,
  HUNGER_THRESHOLD_BEFORE_ENERGY_LOSS,
  BASE_EPOCH_DURATION,
  EPOCH_OFFSET,
  EPOCH_LOG_BASE,
  LINEAR_ADJUSTMENT_FACTOR,
  LOG_BASE_START,
  LOG_BASE_END,
  ATTENUATION_FACTOR,
  LINEAR_ADJUST_FACTOR,
} from '../../../common/config/constants';
import { formatDateForMySQL } from '../../../common/utils/dateUtils';
import { BasicActionsService } from './basic-actions.service';
import { DinosaurAction } from '../models/dinosaur-action.enum';
import { applyEventToDinosaur, getRandomEventForAction } from '../utils/dinosaur-actions.util';
import { Epoch } from '../models/epoch.enum';

/**
 * Service pour ajuster les statistiques d'un dinosaure en fonction du temps écoulé depuis la dernière mise à jour.
 */
export class DinosaurTimeService {
  private basicActionsService: BasicActionsService;

  constructor(basicActionsService: BasicActionsService) {
    this.basicActionsService = basicActionsService;
  }

  public adjustDinosaurStats(dinosaur: Dinosaur): Dinosaur {
    if (!dinosaur || !dinosaur.last_update_by_time_service || dinosaur.food === undefined || dinosaur.energy === undefined || dinosaur.hunger === undefined) {
      console.error('Les informations du dinosaure sont incomplètes ou invalides.');
      return dinosaur;
    }

    if (dinosaur.isDead) {
      console.log('Le dinosaure est mort. Les stats sont maintenues à zéro.');
      dinosaur.food = 0;
      dinosaur.energy = 0;
      dinosaur.hunger = dinosaur.max_hunger;
      return dinosaur;
    }

    // Calculer l'époque du dinosaure
    dinosaur.epoch = this.calculateEpoch(dinosaur.last_reborn);

    const lastUpdated = new Date(dinosaur.last_update_by_time_service);
    const now = new Date();
    const timeElapsedInSeconds = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);

    if (timeElapsedInSeconds > 0) {
      if (dinosaur.isSleeping) {
        // Régénération de l'énergie pendant le sommeil
        let energyRecovery = timeElapsedInSeconds * ENERGY_RECOVERY_RATE_PER_SECOND * dinosaur.multipliers.earn_energy_multiplier;
        dinosaur.energy = Math.min(dinosaur.max_energy, dinosaur.energy + energyRecovery);

        // Vérifier si le dinosaure a atteint son énergie maximale
        if (dinosaur.energy >= dinosaur.max_energy) {
          // Réveil automatique du dinosaure
          console.log('Le dinosaure a atteint son énergie maximale et se réveille automatiquement.');

          // Utiliser l'événement de réveil pour appliquer les changements
          const event = getRandomEventForAction(DinosaurAction.WakeUp, dinosaur.level);

          dinosaur.isSleeping = false;
          applyEventToDinosaur(dinosaur, DinosaurAction.WakeUp, event);
        }

        // Augmentation plus lente de la faim pendant le sommeil
        const hungerIncreaseWhileSleeping = timeElapsedInSeconds * HUNGER_INCREASE_PER_SECOND_WHILE_SLEEPING;
        dinosaur.hunger = Math.min(dinosaur.max_hunger, dinosaur.hunger + hungerIncreaseWhileSleeping);
      } else {
        // Augmentation de la faim quand le dinosaure est éveillé
        const hungerIncrease = timeElapsedInSeconds * HUNGER_INCREASE_PER_SECOND;
        dinosaur.hunger = Math.min(dinosaur.max_hunger, dinosaur.hunger + hungerIncrease);

        // Décroissance d'énergie normale lorsque le dinosaure est éveillé
        const energyDecay = timeElapsedInSeconds * ENERGY_DECAY_RATE_PER_SECOND;
        dinosaur.energy = Math.max(0, dinosaur.energy - energyDecay);

        // Perte d'énergie supplémentaire due à la faim critique
        if (dinosaur.hunger >= HUNGER_THRESHOLD_BEFORE_ENERGY_LOSS) {
          const hungerEnergyLoss = timeElapsedInSeconds * HUNGER_ENERGY_LOSS_RATE_PER_SECOND;
          dinosaur.energy = Math.max(0, dinosaur.energy - hungerEnergyLoss);
        }

        // Si l'énergie atteint zéro, le dinosaure tombe en sommeil
        if (dinosaur.energy === 0 && !dinosaur.isDead) {
          dinosaur.isSleeping = true;
          console.log('Le dinosaure est épuisé et se met en sommeil.');
        }
      }

      // Vérifier la faim maximale et la consommation automatique de nourriture
      while (dinosaur.hunger >= dinosaur.max_hunger && dinosaur.food > 0) {
        const foodToConsume = Math.min(dinosaur.food, dinosaur.hunger);
        dinosaur.food -= foodToConsume;
        dinosaur.hunger -= foodToConsume;
        console.log(`Le dinosaure consomme automatiquement ${foodToConsume} unités de nourriture pour réduire sa faim.`);
      }

      // Vérifier la mort par faim seulement si aucune nourriture n'est disponible
      if (dinosaur.hunger >= dinosaur.max_hunger && dinosaur.food <= 0) {
        dinosaur.isDead = true;
        dinosaur.energy = 0;
        console.log('Le dinosaure est mort de faim.');
      }

      // Mise à jour de la dernière date de mise à jour en format SQL
      dinosaur.last_update_by_time_service = formatDateForMySQL(now);
    }

    return dinosaur;
  }

  /**
   * Calcul l'époque d'un dinosaure en fonction du temps écoulé depuis sa dernière renaissance.
   * @param lastReborn La date du dernier reborn du dinosaure.
   * @returns Le type d'époque ('past', 'present', 'future').
   */

  public calculateEpoch(lastReborn: string): Epoch {
    const rebornDate = new Date(lastReborn);
    const now = new Date();
    const timeElapsedInSeconds = (now.getTime() - rebornDate.getTime()) / 1000;
  
    const epochValues = Object.values(Epoch);
    let cumulativeTime = 0;
  
    for (let i = 0; i < epochValues.length; i++) {
      const logBase = LOG_BASE_START + (LOG_BASE_END - LOG_BASE_START) * (i / (epochValues.length - 1));
      const adjustedIndex = i * ATTENUATION_FACTOR;
      const epochDuration = BASE_EPOCH_DURATION * Math.log(adjustedIndex + 1) / Math.log(logBase) + (i * LINEAR_ADJUST_FACTOR);

      cumulativeTime += epochDuration;
  
      if (timeElapsedInSeconds < cumulativeTime) {
        return epochValues[i] as Epoch;
      }
    }
  
    return epochValues[epochValues.length - 1] as Epoch;
  }
}

