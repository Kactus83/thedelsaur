import { DinosaurAction } from './DinosaurAction';
import { EventModifier } from './EventModifier';

/**
 * Interface représentant un événement appliqué à un dinosaure.
 * Elle reflète la structure envoyée par le backend.
 */
export interface DinosaurEvent {
  id: number;
  name: string;
  description?: string;
  actionType: DinosaurAction;
  minLevel: number;
  weight: number;
  positivityScore: number;
  modifiers: EventModifier[];
}
