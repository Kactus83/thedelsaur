// src/modules/dinosaurs/libs/dinosaur-events.mapping.ts

import { DinosaurEvent } from '../models/dinosaur-event.interface';
import { DinosaurAction } from '../models/dinosaur-action.enum';
import { BASE_ENERGY, BASE_FOOD, BASE_MAX_HUNGER, ENERGY_COST_TO_GRAZE, ENERGY_COST_TO_HUNT } from '../../../common/config/constants';

export const DinosaurEventsMap: Record<DinosaurAction, DinosaurEvent[]> = {
  // Actions avec un seul événement
  [DinosaurAction.Eat]: [
    {
      name: 'Repas normal',
      description: 'Le dinosaure mange une quantité fixe de nourriture depuis son stock.',
      energyChange: 0,
      foodChange: -500,
      hungerChange: -500,
      weight: 1, 
    },
  ],
  [DinosaurAction.Sleep]: [
    {
      name: 'Sommeil réparateur',
      description: 'Le dinosaure dort et regagne de l\'énergie.',
      energyChange: 0,
      foodChange: 0,
      hungerChange: 0,
      weight: 1,
    },
  ],
  [DinosaurAction.WakeUp]: [
    {
      name: 'Réveil en pleine forme',
      description: 'Le dinosaure se réveille prêt pour une nouvelle journée.',
      energyChange: 0,
      foodChange: 0,
      hungerChange: 0,
      weight: 1,
    },
  ],
  [DinosaurAction.Resurrect]: [
    {
      name: 'Retour à la vie',
      description: 'Le dinosaure est miraculeusement ressuscité avec des ressources moyennes.',
      energyChange: BASE_ENERGY,
      foodChange: BASE_FOOD,
      hungerChange: 0,
      weight: 1,
    },
  ],

  // Actions avec plusieurs événements possibles
  [DinosaurAction.Graze]: [
    {
      name: 'Bonne cueillette',
      description: 'Le dinosaure trouve une grande quantité de plantes.',
      energyChange: -ENERGY_COST_TO_GRAZE,
      foodChange: 500,
      hungerChange: -300,
      weight: 5,
    },
    {
      name: 'Cueille légère',
      description: 'Le dinosaure ne trouve que quelques herbes.',
      energyChange: -ENERGY_COST_TO_GRAZE,
      foodChange: 200,
      hungerChange: -100,
      weight: 3,
    },
    {
      name: 'Cueille inefficace',
      description: 'La cueillette est infructueuse, très peu de nourriture trouvée.',
      energyChange: -ENERGY_COST_TO_GRAZE,
      foodChange: 100,
      hungerChange: -50,
      weight: 2,
    },
  ],
  [DinosaurAction.Hunt]: [
    {
      name: 'Chasse réussie',
      description: 'Le dinosaure attrape une grande proie, régénérant beaucoup de nourriture.',
      energyChange: -ENERGY_COST_TO_HUNT,
      foodChange: 1200,
      hungerChange: 100,
      weight: 1,
    },
    {
      name: 'Chasse modérée',
      description: 'Le dinosaure attrape une proie moyenne.',
      energyChange: -ENERGY_COST_TO_HUNT,
      foodChange: 800,
      hungerChange: 100,
      weight: 3,
    },
    {
      name: 'Chasse difficile',
      description: 'La proie est petite et difficile à attraper.',
      energyChange: -ENERGY_COST_TO_HUNT,
      foodChange: 400,
      hungerChange: 100,
      weight: 2,
    },
    {
      name: 'Chasse infructueuse',
      description: 'Le dinosaure n’a pas réussi à attraper de proie.',
      energyChange: -ENERGY_COST_TO_HUNT,
      foodChange: 0,
      hungerChange: 0,
      weight: 1,
    },
  ],
};
