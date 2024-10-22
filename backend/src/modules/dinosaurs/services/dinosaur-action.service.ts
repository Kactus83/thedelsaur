import { Dinosaur } from '../models/dinosaur.interface';
import {
  BASE_FOOD,
  BASE_ENERGY,
  MIN_FOOD_PER_MEAL,
  MAX_FOOD_PER_MEAL,
  ENERGY_COST_TO_EAT,
} from '../../../common/config/constants';
import { getRandomInt } from '../../../common/utils/randomUtils';
import { DinosaurAction } from '../models/dinosaur-action.enum';
import { canPerformAction } from '../utils/dinosaur-actions.util';

export class DinosaurActionService {
  public eatDinosaur(dinosaur: Dinosaur): Dinosaur {
    if (!canPerformAction(dinosaur, DinosaurAction.Eat)) {
      throw new Error('Le dinosaure ne peut pas manger.');
    }

    const amount = getRandomInt(MIN_FOOD_PER_MEAL, MAX_FOOD_PER_MEAL);
    dinosaur.food = Math.min(dinosaur.food + amount, dinosaur.max_food);
    dinosaur.energy = Math.max(dinosaur.energy - ENERGY_COST_TO_EAT, 0);
    console.log(`Le dinosaure mange. Nourriture : ${dinosaur.food}, énergie : ${dinosaur.energy}`);

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
    console.log('Le dinosaure a été ressuscité avec des statistiques réinitialisées.');
    return dinosaur;
  }
}
