import { Dinosaur } from '../models/dinosaur.interface';
import {
  BASE_FOOD,
  BASE_ENERGY,
  MIN_FOOD_PER_MEAL,
  MAX_FOOD_PER_MEAL,
  MAX_ENERGY_NO_SLEEP,
  MIN_ENERGY_TO_WAKE_UP,
  ENERGY_COST_TO_EAT
} from '../../../common/config/constants';
import { getRandomInt } from '../../../common/utils/randomUtils';

export class DinosaurActionService {
  // Action : Manger
  public eatDinosaur(dinosaur: Dinosaur): Dinosaur {
    if (dinosaur.isDead) {
      throw new Error('Le dinosaure est mort et ne peut pas manger.');
    }

    if (dinosaur.isSleeping) {
      throw new Error('Le dinosaure est endormi et ne peut pas manger.');
    }

    if (dinosaur.energy < ENERGY_COST_TO_EAT) {
      throw new Error('Le dinosaure n\'a pas assez d\'énergie pour manger.');
    }

    // Générer une quantité aléatoire de nourriture à ajouter
    const amount = getRandomInt(MIN_FOOD_PER_MEAL, MAX_FOOD_PER_MEAL);
    const newFood = Math.min(dinosaur.food + amount, dinosaur.max_food);
    dinosaur.food = newFood;

    // Réduire l'énergie du dinosaure après avoir mangé
    dinosaur.energy = Math.max(dinosaur.energy - ENERGY_COST_TO_EAT, 0);

    console.log(`Le dinosaure mange. Nourriture passée de ${dinosaur.food - amount} à ${newFood}, énergie réduite à ${dinosaur.energy}.`);

    return dinosaur;
  }

  // Action : Se mettre en sommeil
  public sleepDinosaur(dinosaur: Dinosaur): Dinosaur {
    if (dinosaur.isDead) {
      throw new Error('Le dinosaure est mort et ne peut pas se mettre en sommeil.');
    }

    if (dinosaur.isSleeping) {
      throw new Error('Le dinosaure est déjà en sommeil.');
    }

    if (dinosaur.energy > MAX_ENERGY_NO_SLEEP) {
      throw new Error(`L'énergie (${dinosaur.energy}) est supérieure à la limite pour se mettre en sommeil.`);
    }

    dinosaur.isSleeping = true;
    console.log('Le dinosaure est maintenant en sommeil.');
    return dinosaur;
  }

  // Action : Se réveiller
  public wakeDinosaur(dinosaur: Dinosaur): Dinosaur {
    if (dinosaur.isDead) {
      throw new Error('Le dinosaure est mort et ne peut pas se réveiller.');
    }

    if (!dinosaur.isSleeping) {
      throw new Error('Le dinosaure est déjà éveillé.');
    }

    if (dinosaur.energy < MIN_ENERGY_TO_WAKE_UP) {
      throw new Error(`L'énergie (${dinosaur.energy}) est inférieure à la limite requise pour se réveiller.`);
    }

    dinosaur.isSleeping = false;
    console.log('Le dinosaure s\'est réveillé.');
    return dinosaur;
  }

  // Action : Ressusciter
  public resurrectDinosaur(dinosaur: Dinosaur): Dinosaur {
    if (!dinosaur.isDead) {
      throw new Error('Le dinosaure n\'est pas mort et ne peut pas être ressuscité.');
    }

    dinosaur.isDead = false;
    dinosaur.isSleeping = false;
    dinosaur.food = BASE_FOOD;
    dinosaur.energy = BASE_ENERGY;
    console.log('Le dinosaure a été ressuscité avec des statistiques réinitialisées.');
    return dinosaur;
  }
}