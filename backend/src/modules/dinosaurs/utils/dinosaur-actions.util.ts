import { Dinosaur } from '../models/dinosaur.interface';
import {
  ENERGY_COST_TO_EAT,
  MAX_ENERGY_NO_SLEEP,
  MIN_ENERGY_TO_WAKE_UP,
} from '../../../common/config/constants';
import { DinosaurAction } from '../models/dinosaur-action.enum';

export function canPerformAction(dinosaur: Dinosaur, action: DinosaurAction): boolean {
  if (dinosaur.isDead) {
    return action === DinosaurAction.Resurrect;
  }

  switch (action) {
    case DinosaurAction.Eat:
      return !dinosaur.isSleeping && dinosaur.energy >= ENERGY_COST_TO_EAT;
    case DinosaurAction.Sleep:
      return !dinosaur.isSleeping && dinosaur.energy <= MAX_ENERGY_NO_SLEEP;
    case DinosaurAction.WakeUp:
      return dinosaur.isSleeping && dinosaur.energy >= MIN_ENERGY_TO_WAKE_UP;
    default:
      return false;
  }
}

export function getAvailableActions(dinosaur: Dinosaur): DinosaurAction[] {
  return Object.values(DinosaurAction).filter(action => canPerformAction(dinosaur, action));
}