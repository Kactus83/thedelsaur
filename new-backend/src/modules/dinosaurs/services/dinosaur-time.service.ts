import { Dinosaur } from '../models/dinosaur.interface';
import { formatDateForMySQL } from '../../../common/utils/dateUtils';
import {
  FOOD_DECAY_RATE_PER_SECOND,
  ENERGY_DECAY_RATE_PER_SECOND,
  ENERGY_RECOVERY_RATE_PER_SECOND
} from '../../../common/config/constants';

/**
 * Service pour ajuster les statistiques d'un dinosaure en fonction du temps écoulé depuis la dernière mise à jour.
 */
export class DinosaurTimeService {
  public adjustDinosaurStats(dinosaur: Dinosaur): Dinosaur {
    if (!dinosaur || !dinosaur.last_update_by_time_service || dinosaur.food === undefined || dinosaur.energy === undefined) {
      console.error('Les informations du dinosaure sont incomplètes ou invalides.');
      return dinosaur;
    }

    // Si le dinosaure est mort, les stats doivent être à zéro et rien n'évolue
    if (dinosaur.isDead) {
      console.log('Le dinosaure est mort. Les stats sont mises à zéro.');
      dinosaur.food = 0;
      dinosaur.energy = 0;
      return dinosaur;
    }

    const lastUpdated = new Date(dinosaur.last_update_by_time_service);
    const now = new Date();
    const timeElapsedInSeconds = Math.floor((now.getTime() - lastUpdated.getTime()) / 1000);

    if (timeElapsedInSeconds > 0) {
      if (dinosaur.isSleeping) {
        // Si le dinosaure dort : énergie augmente, nourriture ne diminue pas
        const energyRecovery = timeElapsedInSeconds * ENERGY_RECOVERY_RATE_PER_SECOND;
        dinosaur.energy = Math.min(dinosaur.max_energy, dinosaur.energy + energyRecovery);
      } else {
        // Si le dinosaure est éveillé : nourriture et énergie diminuent
        const foodDecay = timeElapsedInSeconds * FOOD_DECAY_RATE_PER_SECOND;
        const energyDecay = timeElapsedInSeconds * ENERGY_DECAY_RATE_PER_SECOND;

        dinosaur.food = Math.max(0, dinosaur.food - foodDecay);
        dinosaur.energy = Math.max(0, dinosaur.energy - energyDecay);
      }

      // Vérifier les conditions pour changer les états
      if (dinosaur.food === 0 && !dinosaur.isDead) {
        dinosaur.isDead = true;
        dinosaur.energy = 0;
      }

      if (dinosaur.energy === 0 && !dinosaur.isSleeping && !dinosaur.isDead) {
        dinosaur.isSleeping = true;
      }

      dinosaur.last_update_by_time_service = formatDateForMySQL(now);
    }

    return dinosaur;
  }
}
