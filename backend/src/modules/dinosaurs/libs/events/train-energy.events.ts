import { DinosaurEvent } from "../../models/dinosaur-event.interface";

export const trainEnergyEvents: DinosaurEvent[] = [
  // Événements qui augmentent le earn_energy_multiplier
  {
    name: 'Entraînement d\'endurance',
    description: 'Votre dinosaure s\'engage dans un entraînement intensif, améliorant sa récupération d\'énergie.',
    minLevel: 1,
    experienceChange: 50,
    energyChange: -15,
    foodChange: 0,
    hungerChange: 10,
    karmaChange: 0,
    weight: 3,
    multiplierChanges: {
      earn_energy_multiplier: 0.05, // Augmente le multiplicateur de récupération d'énergie de 0.05
    },
  },
  {
    name: 'Méditation profonde',
    description: 'Votre dinosaure pratique la méditation, augmentant légèrement sa récupération d\'énergie.',
    minLevel: 5,
    experienceChange: 30,
    energyChange: 10,
    foodChange: 0,
    hungerChange: 5,
    karmaChange: 0,
    weight: 2,
    multiplierChanges: {
      earn_energy_multiplier: 0.02,
    },
  },
  // Événements qui augmentent le max_energy_multiplier
  {
    name: 'Découverte d\'une source d\'énergie',
    description: 'Votre dinosaure découvre une source d\'énergie naturelle qui augmente son énergie maximale.',
    minLevel: 3,
    experienceChange: 40,
    energyChange: 20,
    foodChange: 0,
    hungerChange: 5,
    karmaChange: 0,
    weight: 2,
    multiplierChanges: {
      max_energy_multiplier: 0.1, // Augmente le multiplicateur d'énergie maximale de 0.1
    },
  },
  {
    name: 'Régime énergétique',
    description: 'En adoptant un régime spécial, votre dinosaure augmente son énergie maximale.',
    minLevel: 6,
    experienceChange: 35,
    energyChange: 0,
    foodChange: -15, // Consomme de la nourriture pour le régime
    hungerChange: 10,
    karmaChange: 0,
    weight: 2,
    multiplierChanges: {
      max_energy_multiplier: 0.08,
    },
  },
  // Événements négatifs affectant le earn_energy_multiplier
  {
    name: 'Fatigue chronique',
    description: 'Votre dinosaure souffre de fatigue, réduisant sa récupération d\'énergie.',
    minLevel: 2,
    experienceChange: -20,
    energyChange: -25,
    foodChange: 0,
    hungerChange: 15,
    karmaChange: -5,
    weight: 1,
    multiplierChanges: {
      earn_energy_multiplier: -0.05, // Diminue le multiplicateur de récupération d'énergie de 0.05
    },
  },
  // Événements négatifs affectant le max_energy_multiplier
  {
    name: 'Blessure grave',
    description: 'Une blessure réduit l\'énergie maximale de votre dinosaure.',
    minLevel: 4,
    experienceChange: -30,
    energyChange: -30,
    foodChange: 0,
    hungerChange: 20,
    karmaChange: -10,
    weight: 1,
    multiplierChanges: {
      max_energy_multiplier: -0.1,
    },
  },
];
