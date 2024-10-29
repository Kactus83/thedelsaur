import { DinosaurEvent } from '../models/dinosaur-event.interface';
import { DinosaurAction } from '../models/dinosaur-action.enum';
import { BASE_ENERGY, BASE_FOOD, BASE_MAX_HUNGER, ENERGY_COST_TO_DISCOVER, ENERGY_COST_TO_GRAZE, ENERGY_COST_TO_HUNT } from '../../../common/config/constants';

export const DinosaurEventsMap: Record<DinosaurAction, DinosaurEvent[]> = {
  // Actions avec un seul événement
  [DinosaurAction.Eat]: [
    {
      name: 'Repas normal',
      description: 'Le dinosaure mange une quantité fixe de nourriture depuis son stock.',
      minLevel: 0,
      experienceChange: 0,
      energyChange: 0,
      foodChange: 0, // defini dans le service
      hungerChange: -500,
      weight: 1, 
    },
  ],
  [DinosaurAction.Sleep]: [
    {
      name: 'Sommeil réparateur',
      description: 'Le dinosaure dort et regagne de l\'énergie.',
      minLevel: 0,
      experienceChange: 0,
      energyChange: 0,
      foodChange: 0,
      hungerChange: 0,
      weight: 1,
    },
  ],
  [DinosaurAction.WakeUp]: [
    {
      name: 'Réveil en pleine forme',
      description: 'Le dinosaure se réveille prêt a tout retourner dans la jungle.',
      minLevel: 0,
      experienceChange: 0,
      energyChange: 0,
      foodChange: 0,
      hungerChange: 0,
      weight: 2,
    },
    {
      name: 'Réveil malade',
      description: 'Le dinosaure se réveille malade, il manque d energie.',
      minLevel: 0,
      experienceChange: 500,
      energyChange: -500,
      foodChange: 0,
      hungerChange: 0,
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
      weight: 5,
    },
  ],
  [DinosaurAction.Resurrect]: [
    {
      name: 'Retour à la vie en tant que terrien',
      description: 'Le dinosaure est miraculeusement ressuscité avec des ressources moyennes.',
      minLevel: 0,
      experienceChange: 0,
      energyChange: BASE_ENERGY,
      foodChange: BASE_FOOD,
      hungerChange: 0,
      typeChange: "land",
      weight: 5,
    },
    {
      name: 'Retour à la vie en tant que marin',
      description: 'Le dinosaure est miraculeusement ressuscité avec des ressources moyennes.',
      minLevel: 0,
      experienceChange: 0,
      energyChange: BASE_ENERGY,
      foodChange: BASE_FOOD,
      hungerChange: 0,
      typeChange: "sea",
      weight: 5,
    },
    {
      name: 'Retour à la vie en tant que volant',
      description: 'Le dinosaure est miraculeusement ressuscité avec des ressources moyennes.',
      minLevel: 0,
      experienceChange: 0,
      energyChange: BASE_ENERGY,
      foodChange: BASE_FOOD,
      hungerChange: 0,
      typeChange: "air",
      weight: 5,
    },
  ],
  // Actions avec plusieurs événements possibles
  [DinosaurAction.Graze]: [
    {
      name: 'Bonne cueillette',
      description: 'Le dinosaure trouve une grande quantité de plantes.',
      minLevel: 0,
      experienceChange: 250,
      energyChange: -ENERGY_COST_TO_GRAZE,
      foodChange: 2500,
      hungerChange: -100,
      weight: 5,
    },
    {
      name: 'Cueille légère',
      description: 'Le dinosaure ne trouve que quelques herbes.',
      minLevel: 0,
      experienceChange: 100,
      energyChange: -ENERGY_COST_TO_GRAZE,
      foodChange: 2000,
      hungerChange: -50,
      weight: 3,
    },
    {
      name: 'Cueille légère mais épuisante',
      description: 'Le dinosaure ne trouve que quelques herbes, mais il s épuise dans la montagne.',
      minLevel: 0,
      experienceChange: 100,
      energyChange: -ENERGY_COST_TO_GRAZE * 2,
      foodChange: 2000,
      hungerChange: -50,
      weight: 3,
    },
    {
      name: 'Cueille inefficace',
      description: 'La cueillette est infructueuse, très peu de nourriture trouvée.',
      minLevel: 0,
      experienceChange: 250,
      energyChange: -ENERGY_COST_TO_GRAZE,
      foodChange: 1000,
      hungerChange: 0,
      weight: 2,
    },
    {
      name: 'Pure galère',
      description: 'Ya R a se mettre sous la dent.',
      minLevel: 0,
      experienceChange: 500,
      energyChange: -ENERGY_COST_TO_GRAZE * 2,
      foodChange: 0,
      hungerChange: 0,
      weight: 2,
    },
  ],
  [DinosaurAction.Hunt]: [
    {
      name: 'Chasse réussie',
      description: 'Le dinosaure attrape une grande proie, régénérant beaucoup de nourriture.',
      minLevel: 0,
      experienceChange: 250,
      energyChange: -ENERGY_COST_TO_HUNT,
      foodChange: 3000,
      hungerChange: 0,
      weight: 1,
    },
    {
      name: 'Chasse modérée',
      description: 'Le dinosaure attrape une proie moyenne.',
      minLevel: 0,
      experienceChange: 100,
      energyChange: -ENERGY_COST_TO_HUNT,
      foodChange: 2500,
      hungerChange: 0,
      weight: 3,
    },
    {
      name: 'Chasse modérée, mais épuisante',
      description: 'Le dinosaure galère pour attraper une proie moyenne.',
      minLevel: 0,
      experienceChange: 100,
      energyChange: -ENERGY_COST_TO_HUNT * 2,
      foodChange: 1500,
      hungerChange: 0,
      weight: 3,
    },
    {
      name: 'Chasse difficile',
      description: 'La proie est petite et difficile à attraper.',
      minLevel: 0,
      experienceChange: 250,
      energyChange: -ENERGY_COST_TO_HUNT,
      foodChange: 1000,
      hungerChange: 0,
      weight: 2,
    },
    {
      name: 'Chasse infructueuse',
      description: 'Le dinosaure n’a pas réussi à attraper de proie.',
      minLevel: 0,
      experienceChange: 250,
      energyChange: -ENERGY_COST_TO_HUNT,
      foodChange: 0,
      hungerChange: 0,
      weight: 1,
    },
  ],
  [DinosaurAction.Discover]: [
    {
      name: 'Découverte majeure',
      description: 'Le dinosaure fait une découverte majeure.',
      minLevel: 0,
      experienceChange: 2500,
      energyChange: -ENERGY_COST_TO_DISCOVER,
      foodChange: 0,
      hungerChange: 0,
      weight: 2,
    },
    {
      name: 'Découverte moyenne',
      description: 'Le dinosaure fait une découverte moyenne.',
      minLevel: 0,
      experienceChange: 1500,
      energyChange: -ENERGY_COST_TO_DISCOVER,
      foodChange: 0,
      hungerChange: 0,
      weight: 4,
    },
    {
      name: 'Découverte mineure',
      description: 'Le dinosaure fait une découverte mineure.',
      minLevel: 0,
      experienceChange: 750,
      energyChange: -ENERGY_COST_TO_DISCOVER,
      foodChange: 0,
      hungerChange: 0,
      weight: 14,
    },
    {
      name: 'Découverte inutile',
      description: 'Le dinosaure a suivi un papillon.',
      minLevel: 0,
      experienceChange: 0,
      energyChange: -ENERGY_COST_TO_DISCOVER,
      foodChange: 0,
      hungerChange: 0,
      weight: 5,
    },
  ],
};
