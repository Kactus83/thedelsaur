// src/modules/dinosaurs/events/hunt.events.ts

import { ENERGY_COST_TO_HUNT } from "../../../../common/config/actions.constants";
import { DinosaurAction } from "../../models/dinosaur-action.enum";
import { DynamicEventData } from "../../models/dynamic-event-data.interface";

export const huntEvents: DynamicEventData[] = [
  {
    id: 0,
    name: 'Chasse réussie',
    actionType: DinosaurAction.Hunt,
    minLevel: 0,
    positivityScore: 0,
    weight: 40,
    descriptions: [
      "Le dinosaure attrape une proie imposante, remplissant son ventre et son expérience.",
      "Un succès éclatant, la proie est massive et l'expérience monte en flèche.",
      "La chasse est triomphante, une prise généreuse qui booste son moral.",
      "Un moment de gloire où la proie attrapée prouve sa supériorité.",
      "Le prédateur se régale d'une prise exceptionnelle, digne d'un champion."
    ],
    baseModifiers: [
      {
        source: "hunt",
        target: "experience",
        base_value: 250,
        additiveStep: 5,
        additiveIncrement: 50,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "hunt",
        target: "energy",
        base_value: -ENERGY_COST_TO_HUNT,
        additiveStep: 0,
        additiveIncrement: -ENERGY_COST_TO_HUNT,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "hunt",
        target: "food",
        base_value: 1000,
        additiveStep: 1,
        additiveIncrement: 100,
        multiplicativeStep: 10,
        multiplicativeIncrement: 0.1
      }
    ]
  },
  {
    id: 0,
    name: 'Chasse modérée',
    actionType: DinosaurAction.Hunt,
    minLevel: 0,
    positivityScore: 3,
    weight: 20,
    descriptions: [
      "Une proie moyenne est attrapée, suffisante pour calmer la faim.",
      "Le dinosaure réalise une chasse correcte, sans éclat particulier.",
      "Un succès modéré qui apporte juste ce qu'il faut pour se nourrir.",
      "Une prise raisonnable qui donne un petit boost d'expérience.",
      "La chasse modérée remplit son ventre sans fracas."
    ],
    baseModifiers: [
      {
        source: "hunt",
        target: "experience",
        base_value: 250,
        additiveStep: 10,
        additiveIncrement: 250,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "hunt",
        target: "energy",
        base_value: -ENERGY_COST_TO_HUNT,
        additiveStep: 0,
        additiveIncrement: -ENERGY_COST_TO_HUNT,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "hunt",
        target: "food",
        base_value: 1500,
        additiveStep: 2,
        additiveIncrement: 250,
        multiplicativeStep: 10,
        multiplicativeIncrement: 0.1
      }
    ]
  },
  {
    id: 0,
    name: 'Chasse difficile',
    actionType: DinosaurAction.Hunt,
    minLevel: 0,
    positivityScore: -2,
    weight: 15,
    descriptions: [
      "La proie est petite et difficile à attraper, un défi pour le prédateur.",
      "Une chasse laborieuse qui rapporte peu, mais montre la persévérance du dinosaure.",
      "Le dinosaure peine pour une prise modeste, l'effort est palpable.",
      "Un combat ardu pour attraper une proie infime, mais obtenu malgré tout.",
      "La difficulté se fait sentir, et le butin n'est qu'une maigre récompense."
    ],
    baseModifiers: [
      {
        source: "hunt",
        target: "experience",
        base_value: 300,
        additiveStep: 2,
        additiveIncrement: 50,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "hunt",
        target: "energy",
        base_value: -ENERGY_COST_TO_HUNT,
        additiveStep: 0,
        additiveIncrement: -ENERGY_COST_TO_HUNT,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "hunt",
        target: "food",
        base_value: 500,
        additiveStep: 1,
        additiveIncrement: 100,
        multiplicativeStep: 10,
        multiplicativeIncrement: 0.1
      }
    ]
  },
  {
    id: 0,
    name: 'Chasse infructueuse',
    actionType: DinosaurAction.Hunt,
    minLevel: 0,
    positivityScore: -7,
    weight: 20,
    descriptions: [
      "Le dinosaure tente sa chance, mais n'attrape aucune proie.",
      "Un échec de chasse où l'effort est vain.",
      "La proie se dérobe à chaque tentative, laissant le prédateur sur sa faim.",
      "Une chasse infructueuse qui fait perdre de l'énergie sans récompense.",
      "Un moment de déception, la proie reste hors d'atteinte."
    ],
    baseModifiers: [
      {
        source: "hunt",
        target: "experience",
        base_value: 500,
        additiveStep: 25,
        additiveIncrement: 500,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "hunt",
        target: "energy",
        base_value: -ENERGY_COST_TO_HUNT,
        additiveStep: 0,
        additiveIncrement: -ENERGY_COST_TO_HUNT,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      }
    ]
  },
  {
    id: 0,
    name: 'Chasse stratégique',
    actionType: DinosaurAction.Hunt,
    minLevel: 2,
    positivityScore: 7,
    weight: 5,
    descriptions: [
      "Le dinosaure met en œuvre une stratégie ingénieuse pour attraper sa proie.",
      "Une chasse planifiée avec soin qui optimise la prise.",
      "Chaque mouvement est calculé pour maximiser les gains.",
      "Une approche tactique qui prouve son intelligence de prédateur.",
      "La stratégie paie, et le butin est obtenu avec finesse."
    ],
    baseModifiers: [
      {
        source: "hunt",
        target: "experience",
        base_value: 750,
        additiveStep: 25,
        additiveIncrement: 750,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "hunt",
        target: "energy",
        base_value: -ENERGY_COST_TO_HUNT,
        additiveStep: 0,
        additiveIncrement: -ENERGY_COST_TO_HUNT,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "hunt",
        target: "food",
        base_value: 1500,
        additiveStep: 5,
        additiveIncrement: 500,
        multiplicativeStep: 10,
        multiplicativeIncrement: 0.1
      }
    ]
  },
  {
    id: 0,
    name: 'Chasse féroce',
    actionType: DinosaurAction.Hunt,
    minLevel: 4,
    positivityScore: 8,
    weight: 2,
    descriptions: [
      "Le dinosaure engage une chasse féroce, une proie exceptionnelle se laisse capturer.",
      "Une attaque prédatrice qui se solde par un butin remarquable.",
      "Le combat est intense et la récompense à la hauteur de l'effort.",
      "Un moment de fureur contrôlée qui fait monter son expérience.",
      "La chasse féroce prouve la puissance du dinosaure face à ses proies."
    ],
    baseModifiers: [
      {
        source: "hunt",
        target: "experience",
        base_value: 250,
        additiveStep: 10,
        additiveIncrement: 250,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "hunt",
        target: "energy",
        base_value: -ENERGY_COST_TO_HUNT,
        additiveStep: 0,
        additiveIncrement: -ENERGY_COST_TO_HUNT,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "hunt",
        target: "food",
        base_value: 2000,
        additiveStep: 5,
        additiveIncrement: 1000,
        multiplicativeStep: 10,
        multiplicativeIncrement: 0.1
      }
    ]
  },
  {
    id: 0,
    name: 'Chasse légendaire',
    actionType: DinosaurAction.Hunt,
    minLevel: 6,
    positivityScore: 10,
    weight: 1,
    descriptions: [
      "Le dinosaure réalise une chasse épique, capturant une proie mythique.",
      "Un exploit de chasse qui s'inscrit dans la légende.",
      "La proie est d'une ampleur incroyable, marquant un tournant dans sa carrière.",
      "Une chasse légendaire qui restera gravée dans les annales.",
      "Un moment d'exception où chaque geste est une prouesse."
    ],
    baseModifiers: [
      {
        source: "hunt",
        target: "experience",
        base_value: 1000,
        additiveStep: 25,
        additiveIncrement: 1000,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "hunt",
        target: "energy",
        base_value: -ENERGY_COST_TO_HUNT,
        additiveStep: 0,
        additiveIncrement: -ENERGY_COST_TO_HUNT,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "hunt",
        target: "food",
        base_value: 2500,
        additiveStep: 5,
        additiveIncrement: 500,
        multiplicativeStep: 20,
        multiplicativeIncrement: 0.25
      }
    ]
  },
];
