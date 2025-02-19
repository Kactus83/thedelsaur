import { DinosaurAction } from "./dinosaur-action.enum";
import { DynamicEventModifier } from "./dynamic-event-modifier.interface";

/**
 * Interface représentant les données stockées en base pour un DynamicEvent.
 * Ce template permet de générer dynamiquement un événement final (DinosaurEvent)
 * en fonction du niveau du dinosaure.
 */
export interface DynamicEventData {
  id: number;
  name: string;                   // Nom du template (ex: "Réveil dynamique")
  actionType: DinosaurAction;     // L'action concernée (ex: wakeUp, eat, etc.)
  minLevel: number;               // Niveau minimal requis
  positivityScore: number;        // Score de positivité de l'événement
  weight: number;                 // Poids pour la sélection aléatoire
  descriptions: string[];         // Ensemble de descriptions possibles
  baseModifiers: DynamicEventModifier[];  // Les modificateurs de base à adapter
}
