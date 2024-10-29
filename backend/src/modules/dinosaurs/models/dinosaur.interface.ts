import { DietType } from "./dinosaur-diet.type";
import { EpochType } from "./epoch.type";


export interface Dinosaur {
  id: number;
  name: string;
  diet: DietType;
  energy: number;
  max_energy: number;
  food: number;
  max_food: number;
  hunger: number;
  max_hunger: number;
  experience: number;
  level: number;
  epoch: EpochType;
  created_at: Date;
  last_reborn: string;
  last_update_by_time_service: string;
  isSleeping: boolean;
  isDead: boolean;
  user_id: number;
}