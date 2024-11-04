import { DinosaurEvent } from '../models/dinosaur-event.interface';
import { DinosaurAction } from '../models/dinosaur-action.enum';
import { eatEvents } from './events/eat.events';
import { sleepEvents } from './events/sleep.events';
import { wakeUpEvents } from './events/wake-up.events';
import { resurrectEvents } from './events/resurrect.events';
import { grazeEvents } from './events/graze.events';
import { huntEvents } from './events/hunt.events';
import { stealEvents } from './events/steal.events';
import { discoverEvents } from './events/discover.events';

// Agrégation des événements dans un seul Record
export const DinosaurEventsMap: Record<DinosaurAction, DinosaurEvent[]> = {
  [DinosaurAction.Eat]: eatEvents,
  [DinosaurAction.Sleep]: sleepEvents,
  [DinosaurAction.WakeUp]: wakeUpEvents,
  [DinosaurAction.Resurrect]: resurrectEvents,
  [DinosaurAction.Graze]: grazeEvents,
  [DinosaurAction.Hunt]: huntEvents,
  [DinosaurAction.Steal]: stealEvents,
  [DinosaurAction.Discover]: discoverEvents,
};
