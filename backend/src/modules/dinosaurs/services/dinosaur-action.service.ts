import { Dinosaur } from '../models/dinosaur.interface';
import {
  BASE_FOOD,
  BASE_ENERGY,
} from '../../../common/config/constants';
import { DinosaurAction } from '../models/dinosaur-action.enum';
import { canPerformAction, getRandomEventForAction, applyEventToDinosaur } from '../utils/dinosaur-actions.util';
import { DinosaurEvent } from '../models/dinosaur-event.interface';

export class DinosaurActionService {
  public eatDinosaur(dinosaur: Dinosaur, amountToEat: number): { dinosaur: Dinosaur, event: DinosaurEvent } {
    if (!canPerformAction(dinosaur, DinosaurAction.Eat)) {
      throw new Error('Le dinosaure ne peut pas manger.');
    }

    const event: DinosaurEvent = {
      name: 'Repas normal',
      description: 'Le dinosaure mange une quantité fixe de nourriture depuis son stock.',
      energyChange: 0,
      foodChange: -amountToEat,
      hungerChange: -amountToEat,
      weight: 1,
    };

    applyEventToDinosaur(dinosaur, event);
    return { dinosaur, event };
  }

  public sleepDinosaur(dinosaur: Dinosaur): { dinosaur: Dinosaur, event: DinosaurEvent } {
    if (!canPerformAction(dinosaur, DinosaurAction.Sleep)) {
      throw new Error('Le dinosaure ne peut pas dormir.');
    }

    const event: DinosaurEvent = {
      name: 'Sommeil réparateur',
      description: 'Le dinosaure dort et regagne de l\'énergie.',
      energyChange: 0,
      foodChange: 0,
      hungerChange: 0,
      weight: 1,
    };

    dinosaur.isSleeping = true;
    applyEventToDinosaur(dinosaur, event);
    return { dinosaur, event };
  }

  public wakeDinosaur(dinosaur: Dinosaur): { dinosaur: Dinosaur, event: DinosaurEvent } {
    if (!canPerformAction(dinosaur, DinosaurAction.WakeUp)) {
      throw new Error('Le dinosaure ne peut pas se réveiller.');
    }

    const event: DinosaurEvent = {
      name: 'Réveil en pleine forme',
      description: 'Le dinosaure se réveille prêt pour une nouvelle journée.',
      energyChange: 0,
      foodChange: 0,
      hungerChange: 0,
      weight: 1,
    };

    dinosaur.isSleeping = false;
    applyEventToDinosaur(dinosaur, event);
    return { dinosaur, event };
  }

  public resurrectDinosaur(dinosaur: Dinosaur): { dinosaur: Dinosaur, event: DinosaurEvent } {
    if (!canPerformAction(dinosaur, DinosaurAction.Resurrect)) {
      throw new Error('Le dinosaure ne peut pas être ressuscité.');
    }

    const event: DinosaurEvent = {
      name: 'Retour à la vie',
      description: 'Le dinosaure est miraculeusement ressuscité avec des ressources moyennes.',
      energyChange: BASE_ENERGY,
      foodChange: BASE_FOOD,
      hungerChange: -dinosaur.hunger,
      weight: 1,
    };

    dinosaur.isDead = false;
    dinosaur.isSleeping = false;
    applyEventToDinosaur(dinosaur, event);
    return { dinosaur, event };
  }

  public grazeDinosaur(dinosaur: Dinosaur): { dinosaur: Dinosaur, event: DinosaurEvent } {
    if (!canPerformAction(dinosaur, DinosaurAction.Graze)) {
      throw new Error('Le dinosaure ne peut pas cueillir.');
    }

    const event = getRandomEventForAction(DinosaurAction.Graze);
    applyEventToDinosaur(dinosaur, event);

    return { dinosaur, event };
  }

  public huntDinosaur(dinosaur: Dinosaur): { dinosaur: Dinosaur, event: DinosaurEvent } {
    if (!canPerformAction(dinosaur, DinosaurAction.Hunt)) {
      throw new Error('Le dinosaure ne peut pas chasser.');
    }

    const event = getRandomEventForAction(DinosaurAction.Hunt);
    applyEventToDinosaur(dinosaur, event);

    return { dinosaur, event };
  }
}