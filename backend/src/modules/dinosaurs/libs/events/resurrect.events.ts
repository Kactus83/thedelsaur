import { BASE_ENERGY, BASE_FOOD } from "../../../../common/config/constants";
import { DinosaurEvent } from "../../models/dinosaur-event.interface";

export const resurrectEvents: DinosaurEvent[] = [
  {
    name: 'Retour à la vie en tant que terrien',
    description: 'Le dinosaure est miraculeusement ressuscité avec des ressources moyennes.',
    minLevel: 0,
    experienceChange: 0,
    energyChange: BASE_ENERGY,
    foodChange: BASE_FOOD,
    hungerChange: 0,
    karmaChange: 0,
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
    karmaChange: 0,
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
    karmaChange: 0,
    typeChange: "air",
    weight: 5,
  },
];
