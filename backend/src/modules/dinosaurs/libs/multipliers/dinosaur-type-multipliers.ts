import { DinosaurMultiplier } from "../../models/dinosaur-multiplier.interface";
import { DinosaurType } from "../../models/dinosaur-type.type";

export const DinosaurTypeMultipliers: Record<DinosaurType, Partial<Record<keyof DinosaurMultiplier, number>>> = {
    [DinosaurType.LAND]: {
      earn_herbi_food_multiplier: 1,
      earn_carni_food_multiplier: 1,
      earn_food_multiplier: 1,
      earn_energy_multiplier: 1,
      earn_experience_multiplier: 1,
      max_energy_multiplier: 1,
      max_food_multiplier: 1.5,
    },
    [DinosaurType.AIR]: {
      earn_herbi_food_multiplier: 1,
      earn_carni_food_multiplier: 1,
      earn_food_multiplier: 1,
      earn_energy_multiplier: 1.5,
      earn_experience_multiplier: 1,
      max_energy_multiplier: 1,
      max_food_multiplier: 1,
    },
    [DinosaurType.SEA]: {
      earn_herbi_food_multiplier: 1,
      earn_carni_food_multiplier: 1,
      earn_food_multiplier: 1,
      earn_energy_multiplier: 1,
      earn_experience_multiplier: 1,
      max_energy_multiplier: 1.5,
      max_food_multiplier: 1,
    },
  };