import { Dinosaur } from '../models/dinosaur.interface';
import {
  BASE_FOOD,
  BASE_ENERGY,
  MAX_FOOD_PER_HUNT,
  MIN_FOOD_PER_HUNT,
  ENERGY_COST_TO_HUNT,
  ENERGY_COST_TO_GRAZE,
  MAX_FOOD_PER_GRAZE,
  MIN_FOOD_PER_GRAZE,
} from '../../../common/config/constants';
import { getRandomInt } from '../../../common/utils/randomUtils';
import { DinosaurAction } from '../models/dinosaur-action.enum';
import { canPerformAction } from '../utils/dinosaur-actions.util';

export class DinosaurActionService {
  public eatDinosaur(dinosaur: Dinosaur, amountToEat: number): Dinosaur {
    if (!canPerformAction(dinosaur, DinosaurAction.Eat)) {
      throw new Error('Le dinosaure ne peut pas manger.');
    }

    // Quantité de nourriture à consommer depuis le stock, limitée au maximum permis par les constantes
    const amountConsumed = Math.min(amountToEat, dinosaur.food);
    dinosaur.food -= amountConsumed;
    dinosaur.hunger = Math.max(0, dinosaur.hunger - amountConsumed);

    console.log(`Le dinosaure mange ${amountConsumed} de nourriture. Stock restant: ${dinosaur.food}, faim réduite: ${dinosaur.hunger}, énergie : ${dinosaur.energy}`);
    return dinosaur;
  }

  public sleepDinosaur(dinosaur: Dinosaur): Dinosaur {
    if (!canPerformAction(dinosaur, DinosaurAction.Sleep)) {
      throw new Error('Le dinosaure ne peut pas dormir.');
    }

    dinosaur.isSleeping = true;
    console.log('Le dinosaure est maintenant en sommeil.');
    return dinosaur;
  }

  public wakeDinosaur(dinosaur: Dinosaur): Dinosaur {
    if (!canPerformAction(dinosaur, DinosaurAction.WakeUp)) {
      throw new Error('Le dinosaure ne peut pas se réveiller.');
    }

    dinosaur.isSleeping = false;
    console.log('Le dinosaure s\'est réveillé.');
    return dinosaur;
  }

  public resurrectDinosaur(dinosaur: Dinosaur): Dinosaur {
    if (!canPerformAction(dinosaur, DinosaurAction.Resurrect)) {
      throw new Error('Le dinosaure ne peut pas être ressuscité.');
    }

    dinosaur.isDead = false;
    dinosaur.isSleeping = false;
    dinosaur.food = BASE_FOOD;
    dinosaur.energy = BASE_ENERGY;
    dinosaur.hunger = 0;
    console.log('Le dinosaure a été ressuscité avec des statistiques réinitialisées.');
    return dinosaur;
  }

  public grazeDinosaur(dinosaur: Dinosaur): Dinosaur {
    if (!canPerformAction(dinosaur, DinosaurAction.Graze)) {
      throw new Error('Le dinosaure ne peut pas cueillir.');
    }

    const amount = getRandomInt(MIN_FOOD_PER_GRAZE, MAX_FOOD_PER_GRAZE);
    dinosaur.food = Math.min(dinosaur.food + amount, dinosaur.max_food);
    dinosaur.energy = Math.max(dinosaur.energy - ENERGY_COST_TO_GRAZE, 0);
    console.log(`Le dinosaure cueille. Nourriture : ${dinosaur.food}, énergie : ${dinosaur.energy}`);

    return dinosaur;
  }

  public huntDinosaur(dinosaur: Dinosaur): Dinosaur {
    if (!canPerformAction(dinosaur, DinosaurAction.Hunt)) {
      throw new Error('Le dinosaure ne peut pas chasser.');
    }

    const amount = getRandomInt(MIN_FOOD_PER_HUNT, MAX_FOOD_PER_HUNT);
    dinosaur.food = Math.min(dinosaur.food + amount, dinosaur.max_food);
    dinosaur.energy = Math.max(dinosaur.energy - ENERGY_COST_TO_HUNT, 0);
    console.log(`Le dinosaure chasse. Nourriture : ${dinosaur.food}, énergie : ${dinosaur.energy}`);

    return dinosaur;
  }
}
