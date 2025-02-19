import { ENERGY_COST_TO_STEAL } from "../../../../common/config/actions.constants";
import { DinosaurAction } from "../../models/dinosaur-action.enum";
import { DynamicEventData } from "../../models/dynamic-event-data.interface";

export const stealEvents: DynamicEventData[] = [
  {
    id: 0,
    name: "Vol réussi",
    actionType: DinosaurAction.Steal,
    minLevel: 4,
    positivityScore: 0,
    weight: 1,
    descriptions: [
      "Le dinosaure vole habilement et rafle une grosse quantité de ressources.",
      "Un vol réussi, les proies n'ont aucune chance face à lui.",
      "Le vol est un succès éclatant, mais laisse un arrière-goût amer.",
      "Une opération de vol qui rapporte gros, malgré son côté douteux.",
      "Le dinosaure s'empare d'un butin impressionnant dans un geste de bravoure… ou d'arrogance."
    ],
    baseModifiers: [
      {
        source: "steal",
        target: "experience",
        base_value: 500,
        additiveStep: 0,
        additiveIncrement: 0,
        multiplicativeStep: 10,
        multiplicativeIncrement: 0.5
      },
      {
        source: "steal",
        target: "energy",
        base_value: -ENERGY_COST_TO_STEAL,
        additiveStep: 0,
        additiveIncrement: -ENERGY_COST_TO_STEAL,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "steal",
        target: "food",
        base_value: 5000,
        additiveStep: 5,
        additiveIncrement: 1000,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "steal",
        target: "karma",
        base_value: -500,
        additiveStep: 5,
        additiveIncrement: -250,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      }
    ]
  },
  {
    id: 0,
    name: "Vol modéré",
    actionType: DinosaurAction.Steal,
    minLevel: 4,
    positivityScore: 5,
    weight: 3,
    descriptions: [
      "Le dinosaure réussit un vol discret, avec des gains modérés.",
      "Un vol modéré qui rapporte sans faire de vagues.",
      "Les ressources volées sont correctes, mais rien d'extraordinaire.",
      "Un vol raisonnable, juste assez pour satisfaire son appétit de larcin.",
      "Le vol se fait dans la discrétion, sans éclat ni débordement."
    ],
    baseModifiers: [
      {
        source: "steal",
        target: "experience",
        base_value: 750,
        additiveStep: 0,
        additiveIncrement: 250,
        multiplicativeStep: 10,
        multiplicativeIncrement: 0.5
      },
      {
        source: "steal",
        target: "energy",
        base_value: -ENERGY_COST_TO_STEAL,
        additiveStep: 0,
        additiveIncrement: -ENERGY_COST_TO_STEAL,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "steal",
        target: "food",
        base_value: 7500,
        additiveStep: 5,
        additiveIncrement: 1500,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "steal",
        target: "karma",
        base_value: -500,
        additiveStep: 5,
        additiveIncrement: -250,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      }
    ]
  },
  {
    id: 0,
    name: "Vol difficile",
    actionType: DinosaurAction.Steal,
    minLevel: 4,
    positivityScore: -3,
    weight: 5,
    descriptions: [
      "Le dinosaure vole un maigre butin, difficile à attraper.",
      "Un vol difficile qui ne rapporte que peu de ressources.",
      "Le vol est laborieux et les gains sont minimes.",
      "Un vol hasardeux qui ne fournit qu'un maigre trésor.",
      "La réussite du vol est limitée par la difficulté de l'opération."
    ],
    baseModifiers: [
      {
        source: "steal",
        target: "experience",
        base_value: 500,
        additiveStep: 0,
        additiveIncrement: 0,
        multiplicativeStep: 10,
        multiplicativeIncrement: 0.5
      },
      {
        source: "steal",
        target: "energy",
        base_value: -ENERGY_COST_TO_STEAL,
        additiveStep: 0,
        additiveIncrement: -ENERGY_COST_TO_STEAL,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "steal",
        target: "food",
        base_value: 1000,
        additiveStep: 5,
        additiveIncrement: 500,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "steal",
        target: "karma",
        base_value: -500,
        additiveStep: 5,
        additiveIncrement: -250,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      }
    ]
  },
  {
    id: 0,
    name: "Vol infructueux",
    actionType: DinosaurAction.Steal,
    minLevel: 4,
    positivityScore: -7,
    weight: 5,
    descriptions: [
      "Le dinosaure n’a pas réussi à voler de ressources.",
      "Un vol infructueux qui ne rapporte rien.",
      "Les efforts de vol restent vains.",
      "Le dinosaure a tenté sa chance sans succès.",
      "Un vol raté, sans le moindre butin."
    ],
    baseModifiers: [
      {
        source: "steal",
        target: "experience",
        base_value: 500,
        additiveStep: 5,
        additiveIncrement: 0,
        multiplicativeStep: 10,
        multiplicativeIncrement: 0.5
      },
      {
        source: "steal",
        target: "energy",
        base_value: -ENERGY_COST_TO_STEAL,
        additiveStep: 0,
        additiveIncrement: -ENERGY_COST_TO_STEAL,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "steal",
        target: "karma",
        base_value: -400,
        additiveStep: 10,
        additiveIncrement: 100,
        multiplicativeStep: 5,
        multiplicativeIncrement: 0.25
      }
    ]
  },
  {
    id: 0,
    name: "Vol stratégique",
    actionType: DinosaurAction.Steal,
    minLevel: 6,
    positivityScore: 10,
    weight: 2,
    descriptions: [
      "Le dinosaure utilise une stratégie avancée pour voler efficacement.",
      "Un vol stratégique, chaque mouvement est calculé avec précision.",
      "Le vol est planifié, maximisant les gains.",
      "Une approche méthodique qui optimise le vol.",
      "Le dinosaure exécute un vol tactique avec une grande précision."
    ],
    baseModifiers: [
      {
        source: "steal",
        target: "experience",
        base_value: 1000,
        additiveStep: 0,
        additiveIncrement: 0,
        multiplicativeStep: 10,
        multiplicativeIncrement: 0.5
      },
      {
        source: "steal",
        target: "energy",
        base_value: -ENERGY_COST_TO_STEAL,
        additiveStep: 0,
        additiveIncrement: -ENERGY_COST_TO_STEAL,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "steal",
        target: "food",
        base_value: 15000,
        additiveStep: 20,
        additiveIncrement: 5000,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "steal",
        target: "karma",
        base_value: -250,
        additiveStep: 10,
        additiveIncrement: -250,
        multiplicativeStep: 20,
        multiplicativeIncrement: 0.1
      }
    ]
  },
  {
    id: 0,
    name: "Grand vol",
    actionType: DinosaurAction.Steal,
    minLevel: 10,
    positivityScore: 10,
    weight: 1,
    descriptions: [
      "Le dinosaure réalise un grand vol, raflant une quantité massive de ressources.",
      "Un vol spectaculaire qui rapporte gros.",
      "Le grand vol : un coup d'éclat dans le monde du larcin.",
      "Une opération de vol d'envergure, digne des plus grands bandits.",
      "Le dinosaure exécute un vol magistral, laissant ses adversaires sans voix."
    ],
    baseModifiers: [
      {
        source: "steal",
        target: "experience",
        base_value: 1000,
        additiveStep: 0,
        additiveIncrement: 0,
        multiplicativeStep: 10,
        multiplicativeIncrement: 0.5
      },
      {
        source: "steal",
        target: "energy",
        base_value: -ENERGY_COST_TO_STEAL,
        additiveStep: 0,
        additiveIncrement: -ENERGY_COST_TO_STEAL,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "steal",
        target: "food",
        base_value: 20000,
        additiveStep: 20,
        additiveIncrement: 10000,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      },
      {
        source: "steal",
        target: "karma",
        base_value: -1000,
        additiveStep: 20,
        additiveIncrement: -500,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      }
    ]
  }
];
