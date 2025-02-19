import { DinosaurAction } from "../../models/dinosaur-action.enum";
import { DynamicEventData } from "../../models/dynamic-event-data.interface";

export const sleepEvents: DynamicEventData[] = [
  {
    id: 0,
    name: 'Sommeil neutre',
    actionType: DinosaurAction.Sleep,
    minLevel: 0,
    positivityScore: 0,
    weight: 40,
    descriptions: [
      "Le dinosaure s'endort sans rien de spécial, juste assez pour récupérer ses forces.",
      "Une sieste tranquille, sans grande conséquence, comme un entre-deux.",
      "Un sommeil ordinaire, ni réparateur ni perturbant, juste du repos.",
      "Le dinosaure ferme les yeux, et le temps passe sans événements marquants.",
      "Une nuit sans surprises : le repos se fait sans éclats ni incidents."
    ],
    baseModifiers: [] // Aucun modificateur pour le sommeil neutre.
  },
  {
    id: 0,
    name: 'Bon sommeil',
    actionType: DinosaurAction.Sleep,
    minLevel: 0,
    positivityScore: 5,
    weight: 40,
    descriptions: [
      "Le dinosaure s'endort paisiblement et se réveille plein d'énergie !",
      "Un sommeil réparateur qui laisse le dinosaure prêt à conquérir le monde.",
      "Une nuit de rêve : l'énergie se régénère à vue d'œil.",
      "Les paupières du dinosaure se ferment, et il se réveille avec un sourire éclatant.",
      "Une nuit magique, où le repos transforme le dinosaure en véritable machine de guerre."
    ],
    baseModifiers: [
      {
        source: "sleep",
        target: "energy",
        base_value: 500,
        additiveStep: 5,            
        additiveIncrement: 100,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      }
    ]
  },
  {
    id: 0,
    name: 'Mauvais sommeil',
    actionType: DinosaurAction.Sleep,
    minLevel: 0,
    positivityScore: -5,
    weight: 20,
    descriptions: [
      "Le dinosaure se réveille en titubant, visiblement perturbé par des cauchemars farfelus.",
      "Une nuit agitée : le dinosaure a tourné en rond et finit par être affamé.",
      "Les rêves ont mal tourné, laissant le dinosaure groggy et affamé.",
      "Un sommeil chahuté qui augmente inexplicablement la faim du dinosaure.",
      "Le réveil est brutal : entre cauchemars et inconfort, la faim s'installe."
    ],
    baseModifiers: [
      {
        source: "sleep",
        target: "hunger",
        base_value: 500,
        additiveStep: 5,           
        additiveIncrement: 100,
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      }
    ]
  }
];
