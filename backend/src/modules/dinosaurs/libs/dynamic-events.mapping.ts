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
import { prayEvents } from './events/pray.events';
import { DynamicEventData } from '../models/dynamic-event-data.interface';
import { bodyguardEvents } from './events/bodyguard.events';
import { babysitterEvents } from './events/babysitter.events';

// Agrégation des événements dans un seul Record
export const DynamicEventsMap: Record<DinosaurAction, DynamicEventData[]> = {
  [DinosaurAction.Eat]: eatEvents,
  [DinosaurAction.Sleep]: sleepEvents,
  [DinosaurAction.WakeUp]: wakeUpEvents,
  [DinosaurAction.Resurrect]: resurrectEvents,
  [DinosaurAction.Graze]: grazeEvents,
  [DinosaurAction.Hunt]: huntEvents,
  [DinosaurAction.Steal]: stealEvents,
  [DinosaurAction.Discover]: discoverEvents,
  [DinosaurAction.Pray]: prayEvents,
  [DinosaurAction.Bodyguard]: bodyguardEvents,
  [DinosaurAction.Babysitter]: babysitterEvents,
};
