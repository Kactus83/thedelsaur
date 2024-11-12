import { DietType } from "./dinosaur-diet.type";
import { DinosaurMultiplier } from "./dinosaur-multiplier.interface";
import { DinosaurType } from "./dinosaur-type.type";
import { Epoch } from "./epoch.enum";

export interface Dinosaur {
  id: number;
  name: string;
  diet: DietType;
  type: DinosaurType;
  energy: number;
  max_energy: number;
  food: number;
  max_food: number;
  hunger: number;
  max_hunger: number;
  experience: number;
  level: number;
  epoch: Epoch;
  created_at: Date;
  last_reborn: string;
  karma: number;
  last_update_by_time_service: string;
  reborn_amount: number;
  isSleeping: boolean;
  isDead: boolean;
  user_id: number;
  multipliers: DinosaurMultiplier; 
}
