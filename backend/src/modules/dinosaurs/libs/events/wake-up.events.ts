import { DinosaurEvent } from "../../models/dinosaur-event.interface";

export const wakeUpEvents: DinosaurEvent[] = [
  {
    name: 'Réveil en pleine forme',
    description: 'Le dinosaure se réveille prêt à tout retourner dans la jungle.',
    minLevel: 0,
    experienceChange: 0,
    energyChange: 0,
    foodChange: 0,
    hungerChange: 0,
    karmaChange: 0,
    weight: 2,
  },
  {
    name: 'Réveil malade',
    description: 'Le dinosaure se réveille malade, il manque d\'énergie.',
    minLevel: 0,
    experienceChange: 500,
    energyChange: -500,
    foodChange: 0,
    hungerChange: 0,
    karmaChange: 0,
    weight: 1,
  },
  {
    name: 'Réveil normal',
    description: 'Le dinosaure se réveille prêt pour une nouvelle journée.',
    minLevel: 0,
    experienceChange: 500,
    energyChange: -100,
    foodChange: 0,
    hungerChange: 0,
    karmaChange: 0,
    weight: 5,
  },
];
