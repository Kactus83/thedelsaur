import { DinosaurAction } from "../../models/dinosaur-action.enum";
import { DynamicEventData } from "../../models/dynamic-event-data.interface";

export const eatEvents: DynamicEventData[] = [
  {
    id: 0,
    name: 'Repas dynamique',
    actionType: DinosaurAction.Eat,
    minLevel: 0,
    positivityScore: 0,
    weight: 1,
    descriptions: [
      "Le dinosaure savoure un repas classique.",
      "Un repas standard calme la faim.",
      "Le dinosaure mange un repas équilibré.",
      "Un repas complet pour le dinosaure.",
      "Le dinosaure se régale d'un repas.",
    ],
    baseModifiers: [
      {
        source: "eat",
        target: "hunger",
        base_value: -500,
        additiveStep: 0,          // 0 indique pas de scaling additif → effet constant
        additiveIncrement: -500,   // effet constant de -500
        multiplicativeStep: 0,
        multiplicativeIncrement: 0
      }
    ]
  }
];
