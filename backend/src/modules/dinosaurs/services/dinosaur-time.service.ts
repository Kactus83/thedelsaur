import { FrontendDinosaurDTO } from '../models/frontend-dinosaur.dto';
import { Epoch } from '../models/epoch.enum';
import { calculateEpochThresholds } from '../utils/epochUtils';
import { BasicActionsService } from './basic-actions.service';

/**
 * Service chargé d'ajuster les statistiques d'un dinosaure en fonction du temps écoulé.
 * Ce service travaille sur l'objet FrontendDinosaurDTO qui contient à la fois les valeurs persistantes
 * et les valeurs finales calculées (comme final_max_energy, etc.).
 */
export class DinosaurTimeService {
  // Tableau des seuils d'époque, par exemple issu d'un utilitaire de calcul (à adapter)
  private epochThresholds = calculateEpochThresholds();
  private basicActionsService: BasicActionsService;

  /**
   * @param basicActionsService Service permettant d'exécuter les actions de base sur le dinosaure (par ex. réveil automatique).
   */
  constructor(basicActionsService: BasicActionsService) {
    this.basicActionsService = basicActionsService;
  }

  /**
   * Calcule l'époque du dinosaure en fonction du temps écoulé depuis sa dernière renaissance.
   * @param lastReborn Date de la dernière renaissance du dinosaure.
   * @returns L'époque calculée.
   */
  private calculateEpoch(lastReborn: Date): Epoch {
    const now = new Date();
    const elapsedSeconds = (now.getTime() - lastReborn.getTime()) / 1000;

    // Parcours des seuils pour déterminer l'époque
    for (const { epoch, threshold } of this.epochThresholds) {
      if (elapsedSeconds < threshold) {
        return epoch;
      }
    }
    // Si tous les seuils sont dépassés, renvoyer le dernier
    return this.epochThresholds[this.epochThresholds.length - 1].epoch;
  }

  /**
   * Ajuste les statistiques du dinosaure en fonction du temps écoulé depuis la dernière mise à jour.
   * 
   * - En sommeil, le dinosaure récupère de l'énergie (à un taux défini dans energy_recovery_per_second)
   *   et sa faim augmente à un taux réduit.
   * - En état éveillé, le dinosaure perd de l'énergie (energy_decay_per_second) et sa faim augmente normalement.
   * - Si l'énergie atteint 0, le dinosaure est mis en sommeil.
   * - Si l'énergie atteint son maximum (final_max_energy), le dinosaure se réveille automatiquement.
   * - Si la faim atteint son maximum et qu'il dispose encore de nourriture, il mange automatiquement (après avoir été réveillé s'il est en sommeil).
   *   Sinon, il meurt de faim.
   * - L'époque est recalculée en fonction de last_reborn.
   * - La date de dernière mise à jour est rafraîchie.
   * 
   * @param dino L'objet FrontendDinosaurDTO à mettre à jour.
   * @returns Le dinosaure ajusté.
   */
  public async adjustDinosaurStats(dino: FrontendDinosaurDTO): Promise<FrontendDinosaurDTO> {
    if (!dino || !dino.last_update_by_time_service) {
      console.error('Informations insuffisantes pour ajuster les statistiques du dinosaure.');
      return dino;
    }

    // Si le dinosaure est mort, aucune modification n'est effectuée.
    if (dino.is_dead) {
      console.log('Dinosaure mort, aucune mise à jour effectuée.');
      return dino;
    }

    const lastUpdate = new Date(dino.last_update_by_time_service);
    const now = new Date();
    const elapsedSeconds = Math.floor((now.getTime() - lastUpdate.getTime()) / 1000);

    // Mise à jour de l'époque en fonction du temps écoulé depuis le dernier reborn
    dino.epoch = this.calculateEpoch(dino.last_reborn);

    if (elapsedSeconds > 0) {
      if (dino.is_sleeping) {
        // Récupération d'énergie pendant le sommeil
        const energyRecovered = elapsedSeconds * dino.energy_recovery_per_second;
        dino.energy = Math.min(dino.final_max_energy, dino.energy + energyRecovered);

        // Augmentation de la faim pendant le sommeil (à un taux réduit)
        const hungerIncrease = elapsedSeconds * dino.hunger_increase_per_second_when_recovery;
        dino.hunger = Math.min(dino.final_max_hunger, dino.hunger + hungerIncrease);

        // Si l'énergie atteint son maximum, réveiller le dinosaure via le BasicActionsService
        if (dino.energy >= dino.final_max_energy) {
          console.log('Dinosaure réveillé automatiquement (énergie maximale atteinte).');
          await this.basicActionsService.wakeDinosaur(dino);
        }
      } else {
        // Perte d'énergie en état éveillé
        const energyLost = elapsedSeconds * dino.energy_decay_per_second;
        dino.energy = Math.max(0, dino.energy - energyLost);

        // Augmentation de la faim en état éveillé
        const hungerIncrease = elapsedSeconds * dino.hunger_increase_per_second;
        dino.hunger = Math.min(dino.final_max_hunger, dino.hunger + hungerIncrease);

        // Si l'énergie tombe à zéro, passage en sommeil
        if (dino.energy === 0) {
          dino.is_sleeping = true;
          console.log('Dinosaure épuisé, passage en sommeil.');
        }
      }
      // Mise à jour de la date de dernière mise à jour
      dino.last_update_by_time_service = now;
    }

    // Vérifier si la faim est au maximum
    if (dino.hunger >= dino.final_max_hunger) {
      if (dino.food > 0) {
        console.log('Faim maximale détectée, auto-alimentation du dinosaure.');
        // Si le dinosaure est en sommeil, le réveiller d'abord
        if (dino.is_sleeping) {
          console.log('Dinosaure en sommeil, réveil automatique avant auto-alimentation.');
          await this.basicActionsService.wakeDinosaur(dino);
        }
        // Auto-alimentation
        const result = this.basicActionsService.eatDinosaur(dino);
        dino = result.dinosaur;
      } else {
        console.log('Dinosaure meurt de faim (aucune nourriture disponible).');
        dino.is_dead = true;
      }
    }

    return dino;
  }
}
