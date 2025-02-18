/**
 * Interface représentant le dinosaure stocké en base de données.
 * Contient les caractéristiques de base (préfixées par "base_") et les earn multipliers.
 */
export interface BackendDinosaur {
  id: number;
  name: string;
  userId: number;
  dietId: number;
  typeId: number;
  
  // Caractéristiques de base (initiales)
  base_energy: number;
  base_max_energy: number;
  base_food: number;
  base_max_food: number;
  base_hunger: number;
  base_max_hunger: number;
  
  // Earn multipliers stockés dans le dinosaure
  earn_food_global_multiplier: number;
  earn_food_herbi_multiplier: number;
  earn_food_carni_multiplier: number;
  earn_energy_multiplier: number;
  earn_experience_multiplier: number;
  earn_skill_point_multiplier: number;
  earn_money_multiplier: number;
  earn_karma_multiplier: number;
  
  // Autres attributs de jeu
  hunger: number;
  karma: number;
  experience: number;
  level: number;
  money: number;
  skill_points: number;
  
  created_at: Date;
  last_reborn: Date;
  reborn_amount: number;
  last_update_by_time_service: Date;
  is_sleeping: boolean;
  is_dead: boolean;
}
