import { DinosaurEvent } from "../../models/dinosaur-event.interface";

export const eatEvents: DinosaurEvent[] = [
  {
    name: 'Repas normal',
    description: 'Le dinosaure mange une quantité fixe de nourriture depuis son stock.',
    minLevel: 0,
    experienceChange: 0,
    energyChange: 0,
    foodChange: 0, // défini dans le service
    hungerChange: -500,
    karmaChange: 0,
    weight: 1, 
  },
];
