import { Dinosaur } from '../models/dinosaur.interface';
import { DinosaurAction } from '../models/dinosaur-action.enum';
import { canPerformAction, getRandomEventForAction, applyEventToDinosaur } from '../utils/dinosaur-actions.util';
import { DinosaurEvent } from '../models/dinosaur-event.interface';
import { BASE_ENERGY, BASE_FOOD, KARMA_GAIN_AFTER_DEATH } from '../../../common/config/constants';
import { getRandomDiet } from '../../auth/utils/dinosaurs.util';

export class DinosaurActionService {

    // Conversion de la date pour le format compatible MySQL
    private formatDateForMySQL(date: Date): string {
      return date.toISOString().slice(0, 19).replace('T', ' ');
    }
  
    public eatDinosaur(dinosaur: Dinosaur): { dinosaur: Dinosaur, event: DinosaurEvent } {
      if (!canPerformAction(dinosaur, DinosaurAction.Eat)) {
          throw new Error('Le dinosaure ne peut pas manger.');
      }

      // Calcule la quantité de nourriture à consommer pour réduire la faim autant que possible
      const foodNeeded = Math.min(dinosaur.hunger, dinosaur.food);

      // Si aucune nourriture n'est disponible ou aucune faim n'est présente, renvoie un événement indiquant l'échec
      if (foodNeeded <= 0) {
          return {
              dinosaur,
              event: {
                  name: 'Pas de nourriture suffisante',
                  description: 'Le dinosaure n\'a pas assez de nourriture pour satisfaire sa faim.',
                  minLevel: 0,
                  experienceChange: 0,
                  energyChange: 0,
                  foodChange: 0,
                  hungerChange: 0,
                  karmaChange: 0,
                  weight: 1,
              },
          };
      }

      // Crée l'événement basé sur la consommation réelle de nourriture
      const event: DinosaurEvent = {
          name: 'Repas optimisé',
          description: 'Le dinosaure utilise la nourriture disponible pour réduire sa faim.',
          minLevel: 0,
          experienceChange: 0,
          energyChange: 0,
          foodChange: -foodNeeded,  // Consomme la quantité calculée de nourriture
          hungerChange: -foodNeeded, // Réduit la faim par la même quantité
          karmaChange: 0,
          weight: 1,
      };

      // Applique l'événement au dinosaure
      applyEventToDinosaur(dinosaur, event);
      return { dinosaur, event };
  }

  public sleepDinosaur(dinosaur: Dinosaur): { dinosaur: Dinosaur, event: DinosaurEvent } {
    if (!canPerformAction(dinosaur, DinosaurAction.Sleep)) {
      throw new Error('Le dinosaure ne peut pas dormir.');
    }

    const event = getRandomEventForAction(DinosaurAction.Sleep, dinosaur.level);

    dinosaur.isSleeping = true;
    applyEventToDinosaur(dinosaur, event);
    return { dinosaur, event };
  }

  public wakeDinosaur(dinosaur: Dinosaur): { dinosaur: Dinosaur, event: DinosaurEvent } {
    if (!canPerformAction(dinosaur, DinosaurAction.WakeUp)) {
      throw new Error('Le dinosaure ne peut pas se réveiller.');
    }

    const event = getRandomEventForAction(DinosaurAction.WakeUp, dinosaur.level);

    dinosaur.isSleeping = false;
    applyEventToDinosaur(dinosaur, event);
    return { dinosaur, event };
  }

  public resurrectDinosaur(dinosaur: Dinosaur): { dinosaur: Dinosaur, event: DinosaurEvent } {
    if (!canPerformAction(dinosaur, DinosaurAction.Resurrect)) {
      throw new Error('Le dinosaure ne peut pas être ressuscité.');
    }

    const event = getRandomEventForAction(DinosaurAction.Resurrect, dinosaur.level);

    dinosaur.isDead = false;
    dinosaur.diet = getRandomDiet();
    dinosaur.isSleeping = false;
    dinosaur.energy = 0;
    dinosaur.food = 0;
    dinosaur.hunger = 0;
    dinosaur.last_reborn = this.formatDateForMySQL(new Date());
    dinosaur.experience = 0;
    dinosaur.level = 1;
    dinosaur.reborn_amount = dinosaur.reborn_amount + 1;
    dinosaur.karma = dinosaur.karma + KARMA_GAIN_AFTER_DEATH;
    applyEventToDinosaur(dinosaur, event);
    return { dinosaur, event };
  }

  public grazeDinosaur(dinosaur: Dinosaur): { dinosaur: Dinosaur, event: DinosaurEvent } {
    if (!canPerformAction(dinosaur, DinosaurAction.Graze)) {
      throw new Error('Le dinosaure ne peut pas cueillir.');
    }

    const event = getRandomEventForAction(DinosaurAction.Graze, dinosaur.level);
    applyEventToDinosaur(dinosaur, event);

    return { dinosaur, event };
  }

  public huntDinosaur(dinosaur: Dinosaur): { dinosaur: Dinosaur, event: DinosaurEvent } {
    if (!canPerformAction(dinosaur, DinosaurAction.Hunt)) {
      throw new Error('Le dinosaure ne peut pas chasser.');
    }

    const event = getRandomEventForAction(DinosaurAction.Hunt, dinosaur.level);
    applyEventToDinosaur(dinosaur, event);

    return { dinosaur, event };
  }

  public discoverDinosaur(dinosaur: Dinosaur): { dinosaur: Dinosaur, event: DinosaurEvent } {
    if (!canPerformAction(dinosaur, DinosaurAction.Discover)) {
      throw new Error('Le dinosaure ne peut pas découvrir.');
    }

    const event = getRandomEventForAction(DinosaurAction.Discover, dinosaur.level);
    applyEventToDinosaur(dinosaur, event);

    return { dinosaur, event };
  }

  public stealDinosaur(dinosaur: Dinosaur): { dinosaur: Dinosaur, event: DinosaurEvent } {
    if (!canPerformAction(dinosaur, DinosaurAction.Steal)) {
      throw new Error('Le dinosaure ne peut pas voler.');
    }

    const event = getRandomEventForAction(DinosaurAction.Steal, dinosaur.level);
    applyEventToDinosaur(dinosaur, event);

    return { dinosaur, event };
  }
}