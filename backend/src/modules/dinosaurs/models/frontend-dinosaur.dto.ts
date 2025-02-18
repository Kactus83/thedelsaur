// frontend-dinosaur.dto.ts
import { Exclude, Expose } from 'class-transformer';

/**
 * DTO exposé au frontend.
 * Il contient à la fois les caractéristiques de base (stockées en base) et
 * les valeurs finales calculées (sans le préfixe "base_") pour l'affichage.
 */
@Exclude()
export class FrontendDinosaurDTO {
  @Expose() id!: number;
  @Expose() name!: string;
  @Expose() dietId!: number;
  @Expose() typeId!: number;
  
  // Caractéristiques de base (initiales, telles que stockées dans la table)
  @Expose() base_energy!: number;
  @Expose() base_max_energy!: number;
  @Expose() base_food!: number;
  @Expose() base_max_food!: number;
  @Expose() base_hunger!: number;
  @Expose() base_max_hunger!: number;
  
  // Earn multipliers (tels que stockés dans la table)
  @Expose() earn_food_global_multiplier!: number;
  @Expose() earn_food_herbi_multiplier!: number;
  @Expose() earn_food_carni_multiplier!: number;
  @Expose() earn_energy_multiplier!: number;
  @Expose() earn_experience_multiplier!: number;
  @Expose() earn_skill_point_multiplier!: number;
  @Expose() earn_money_multiplier!: number;
  @Expose() earn_karma_multiplier!: number;
  
  // Autres attributs de jeu
  @Expose() hunger!: number;
  @Expose() karma!: number;
  @Expose() experience!: number;
  @Expose() level!: number;
  @Expose() money!: number;
  @Expose() skill_points!: number;
  
  @Expose() created_at!: Date;
  @Expose() last_reborn!: Date;
  @Expose() reborn_amount!: number;
  @Expose() last_update_by_time_service!: Date;
  @Expose() is_sleeping!: boolean;
  @Expose() is_dead!: boolean;
  
  // Valeurs finales calculées (issues de l'application des modificateurs dynamiques)
  // Ces valeurs sont calculées lors de la récupération en combinant les valeurs de base
  // et l'ensemble des modificateurs (provenant du type, de la diète, et d'autres règles).
  @Expose() final_energy!: number;
  @Expose() final_max_energy!: number;
  @Expose() final_food!: number;
  @Expose() final_max_food!: number;
  @Expose() final_hunger!: number;
  @Expose() final_max_hunger!: number;
}
