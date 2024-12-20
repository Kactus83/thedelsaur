import { DietType } from "../../models/dinosaur-diet.type";
import { DinosaurMultiplier } from "../../models/dinosaur-multiplier.interface";

export const DietTypeMultipliers: Record<DietType, Partial<Record<keyof DinosaurMultiplier, number>>> = {
    [DietType.OMNIVORE]: {
      earn_herbi_food_multiplier: 1,
      earn_carni_food_multiplier: 1,
      earn_food_multiplier: 1.25,
      earn_energy_multiplier: 1,
      earn_experience_multiplier: 1,
      max_energy_multiplier: 1,
      max_food_multiplier: 1,
    },
    [DietType.CARNIVORE]: {
      earn_herbi_food_multiplier: 1,
      earn_carni_food_multiplier: 1.5,
      earn_food_multiplier: 1,
      earn_energy_multiplier: 1,
      earn_experience_multiplier: 1,
      max_energy_multiplier: 1,
      max_food_multiplier: 1,
    },
    [DietType.HERBIVORE]: {
      earn_herbi_food_multiplier: 1.5,
      earn_carni_food_multiplier: 1,
      earn_food_multiplier: 1,
      earn_energy_multiplier: 1,
      earn_experience_multiplier: 1,
      max_energy_multiplier: 1,
      max_food_multiplier: 1,
    },
  };