import { ENERGY_COST_TO_DISCOVER } from "../../../../common/config/constants";
import { DinosaurEvent } from "../../models/dinosaur-event.interface";

export const discoverEvents: DinosaurEvent[] = [
  {
    name: 'Découverte majeure',
    description: 'Le dinosaure fait une découverte majeure.',
    minLevel: 2,
    experienceChange: 2500,
    energyChange: -ENERGY_COST_TO_DISCOVER,
    foodChange: 0,
    hungerChange: 0,
    karmaChange: 0,
    weight: 2,
  },
  {
    name: 'Découverte moyenne',
    description: 'Le dinosaure fait une découverte moyenne.',
    minLevel: 2,
    experienceChange: 1500,
    energyChange: -ENERGY_COST_TO_DISCOVER,
    foodChange: 0,
    hungerChange: 0,
    karmaChange: 0,
    weight: 4,
  },
  {
    name: 'Découverte mineure',
    description: 'Le dinosaure fait une découverte mineure.',
    minLevel: 2,
    experienceChange: 750,
    energyChange: -ENERGY_COST_TO_DISCOVER,
    foodChange: 0,
    hungerChange: 0,
    karmaChange: 0,
    weight: 14,
  },
  {
    name: 'Découverte inutile',
    description: 'Le dinosaure a suivi un papillon.',
    minLevel: 2,
    experienceChange: 0,
    energyChange: -ENERGY_COST_TO_DISCOVER,
    foodChange: 0,
    hungerChange: 0,
    karmaChange: 0,
    weight: 5,
  },
  {
    name: 'Découverte secrète',
    description: 'Le dinosaure découvre un trésor caché dans la forêt.',
    minLevel: 3,
    experienceChange: 2000,
    energyChange: -ENERGY_COST_TO_DISCOVER,
    foodChange: 0,
    hungerChange: 0,
    karmaChange: 100,
    weight: 3,
  },
  {
    name: 'Découverte facile',
    description: 'Le dinosaure découvre des vestiges d\'une civilisation disparue juste à coté de sa tanière.',
    minLevel: 4,
    experienceChange: 3000,
    energyChange: -ENERGY_COST_TO_DISCOVER / 2,
    foodChange: 0,
    hungerChange: 0,
    karmaChange: 200,
    weight: 2,
  },
  {
    name: 'Découverte mystérieuse',
    description: 'Le dinosaure trouve un portail vers une autre dimension.',
    minLevel: 5,
    experienceChange: 4000,
    energyChange: -ENERGY_COST_TO_DISCOVER,
    foodChange: 0,
    hungerChange: 0,
    karmaChange: 0,
    weight: 1,
  },
  {
    name: 'Découverte phénoménale',
    description: 'Le dinosaure découvre une source d\'énergie illimitée, son karma est augmenté.',
    minLevel: 6,
    experienceChange: 5000,
    energyChange: -ENERGY_COST_TO_DISCOVER,
    foodChange: 0,
    hungerChange: 0,
    karmaChange: 200,
    weight: 1,
  },
  {
    name: 'Découverte universelle',
    description: 'Le dinosaure découvre les secrets de l\'univers après avoir mangé un champignon vénéneux.',
    minLevel: 8,
    experienceChange: 8000,
    energyChange: -ENERGY_COST_TO_DISCOVER,
    foodChange: 0,
    hungerChange: 0,
    karmaChange: 500,
    weight: 1,
  },
  {
    name: 'Découverte ultime',
    description: 'Le dinosaure atteint la connaissance ultime de la nature.',
    minLevel: 10,
    experienceChange: 10000,
    energyChange: -ENERGY_COST_TO_DISCOVER,
    foodChange: 0,
    hungerChange: 0,
    karmaChange: 800,
    weight: 1,
  },
];
