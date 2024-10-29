import { Dinosaur } from '../models/dinosaur.interface';
import { DinosaurAction } from '../models/dinosaur-action.enum';
import { canPerformAction, getRandomEventForAction, applyEventToDinosaur } from '../utils/dinosaur-actions.util';
import { DinosaurEvent } from '../models/dinosaur-event.interface';

export class DinosaurActionService {
  public eatDinosaur(dinosaur: Dinosaur, amountToEat: number): { dinosaur: Dinosaur, event: DinosaurEvent } {
    if (!canPerformAction(dinosaur, DinosaurAction.Eat)) {
      throw new Error('Le dinosaure ne peut pas manger.');
    }

    const event = getRandomEventForAction(DinosaurAction.Eat, dinosaur.level);

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
    dinosaur.isSleeping = false;
    dinosaur.last_reborn = new Date().toISOString();
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
}