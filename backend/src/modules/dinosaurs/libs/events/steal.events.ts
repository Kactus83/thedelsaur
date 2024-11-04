import { ENERGY_COST_TO_STEAL } from "../../../../common/config/constants";
import { DinosaurEvent } from "../../models/dinosaur-event.interface";

export const stealEvents: DinosaurEvent[] = [
  {
    name: 'Vol réussi',
    description: 'Le dinosaure vole des ressources à un autre dinosaure.',
    minLevel: 4,
    experienceChange: 500,
    energyChange: -ENERGY_COST_TO_STEAL,
    foodChange: 4000,
    hungerChange: 0,
    karmaChange: -500,
    weight: 1,
  },
  {
    name: 'Vol modéré',
    description: 'Le dinosaure vole des ressources à un autre dinosaure.',
    minLevel: 4,
    experienceChange: 250,
    energyChange: -ENERGY_COST_TO_STEAL,
    foodChange: 3000,
    hungerChange: 0,
    karmaChange: -250,
    weight: 3,
  },
  {
    name: 'Vol modéré, mais épuisant',
    description: 'Le dinosaure vole des ressources à un autre dinosaure.',
    minLevel: 4,
    experienceChange: 500,
    energyChange: -ENERGY_COST_TO_STEAL * 2,
    foodChange: 3000,
    hungerChange: 0,
    karmaChange: -250,
    weight: 3,
  },
  {
    name: 'Vol difficile',
    description: 'Le dinosaure vole des ressources à un autre dinosaure.',
    minLevel: 4,
    experienceChange: 500,
    energyChange: -ENERGY_COST_TO_STEAL,
    foodChange: 1500,
    hungerChange: 0,
    karmaChange: -250,
    weight: 2,
  },
  {
    name: 'Vol infructueux',
    description: 'Le dinosaure n’a pas réussi à voler de ressources.',
    minLevel: 4,
    experienceChange: 500,
    energyChange: -ENERGY_COST_TO_STEAL, 
    foodChange: 0,
    hungerChange: 0,
    karmaChange: -250,
    weight: 1,
  },
  {
    name: 'Vol stratégique',
    description: 'Le dinosaure utilise une stratégie avancée pour voler efficacement.',
    minLevel: 6,
    experienceChange: 700,
    energyChange: -ENERGY_COST_TO_STEAL,
    foodChange: 5000,
    hungerChange: 0,
    karmaChange: -300,
    weight: 2,
  },
  {
    name: 'Grand vol',
    description: 'Le dinosaure vole une quantité massive de ressources.',
    minLevel: 10,
    experienceChange: 1000,
    energyChange: -ENERGY_COST_TO_STEAL,
    foodChange: 8000,
    hungerChange: 0,
    karmaChange: -500,
    weight: 1,
  },
];
