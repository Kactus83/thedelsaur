import { DinosaurBuildingInstanceDTO } from './dinosaur-building-instance.dto';
import { DinosaurItemInstanceDTO } from './dinosaur-item-instance.dto';
import { DinosaurLifeDTO } from './dinosaur-life.dto';
import { DinosaurSkillInstanceDTO } from './dinosaur-skill-instance.dto';
import { DinosaurDiet } from './DinosaurDiet';
import { DinosaurType } from './DinosaurType';
import { Epoch } from './Epoch';
import { StatModifier } from './stats-modifiers.types';

/**
 * Interface représentant l'objet dinosaure tel qu'exposé par le backend.
 */
export interface Dinosaur {
  id: number;
  userId: number;
  name: string;

  //Historique des vies (et scores)
  lives: DinosaurLifeDTO[];
  
  // Assets récents
  skills: DinosaurSkillInstanceDTO[];
  items: DinosaurItemInstanceDTO[];
  buildings: DinosaurBuildingInstanceDTO[];

  // Valeurs de base (identiques pour tous les dinosaures)
  base_max_energy: number;
  energy_decay_per_second: number;
  energy_recovery_per_second: number;
  base_max_food: number;
  base_max_hunger: number;
  hunger_increase_per_second: number;
  hunger_increase_per_second_when_recovery: number;
  karma_width: number;
  
  // Détails techniques
  created_at: Date;
  last_reborn: Date;
  reborn_amount: number;
  last_update_by_time_service: Date;
  is_sleeping: boolean;
  is_dead: boolean;
  
  // Valeurs courantes
  karma: number;
  experience: number;
  level: number;
  money: number;
  skill_points: number;
  epoch: Epoch;
  
  // Vitals
  energy: number;
  food: number;
  hunger: number;
  weapons: number;
  armors: number;
  friends: number;
  employees: number;
  
  // Génétique
  type: DinosaurType;
  diet: DinosaurDiet;
  
  // Modificateurs (issus de level, karma, etc.)
  stats_modifiers: StatModifier[];
  
  // Multiplicateurs finaux (après application des modificateurs)
  final_max_energy: number;
  final_max_food: number;
  final_max_hunger: number;
  final_energy_recovery: number;
  final_energy_decay: number;
  final_hunger_increase: number;
  final_hunger_increase_when_recovery: number;
  food_production: number;
  weapon_production: number;
  armor_production: number;
  friend_production: number;
  employee_production: number;
  final_earn_food_global_multiplier: number;
  final_earn_food_herbi_multiplier: number;
  final_earn_food_carni_multiplier: number;
  final_earn_experience_multiplier: number;
  final_earn_skill_point_multiplier: number;
  final_earn_money_multiplier: number;
  final_earn_karma_multiplier: number;
}
