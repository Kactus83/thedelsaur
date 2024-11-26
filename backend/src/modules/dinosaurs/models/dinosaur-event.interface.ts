import { DinosaurMultiplier } from "./dinosaur-multiplier.interface";
import { DinosaurType } from "./dinosaur-type.type";

export interface DinosaurEvent {
    name: string;                // Nom de l'événement
    description: string;         // Description de l'événement
    energyChange: number;        // Variation de l'énergie
    foodChange: number;          // Variation de la nourriture
    hungerChange: number;        // Variation de la faim
    experienceChange: number;    // Variation de l'expérience
    karmaChange: number;        // Variation du karma
    typeChange?: DinosaurType;          // Variation du type
    multiplierChanges?: Partial<DinosaurMultiplier>; // Modifications des multiplicateurs
    minLevel: number,
    weight: number;              // Facteur de probabilité (poids)
  }