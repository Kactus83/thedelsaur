/**
 * Type de modificateur.
 * - 'additive' : la valeur sera ajoutée.
 * - 'multiplicative' : la valeur sera utilisée en multiplication.
 */
export type ModifierType = 'additive' | 'multiplicative';

export type StatTarget =
    | "base_max_energy"
    | "base_max_food"
    | "base_max_hunger"
    | "energy_recovery_multiplier"
    | "energy_decay_multiplier"
    | "hunger_increase_multiplier"
    | "food_production"
    | "weapon_production"
    | "armor_production"
    | "friend_production"
    | "employee_production"
    | "earn_food_global_multiplier"
    | "earn_food_herbi_multiplier"
    | "earn_food_carni_multiplier"
    | "earn_experience_multiplier"
    | "earn_skill_point_multiplier"
    | "earn_money_multiplier"
    | "earn_karma_multiplier";


/**
 * Interface représentant un modificateur appliqué à une statistique.
 * @property source La provenance du modificateur (ex. "type", "diet", "level", etc.)
 * @property type Le type du modificateur (additive ou multiplicative).
 * @property value La valeur numérique du modificateur.
 * @property target La statistique cible (ex. "base_energy", "earn_food_global_multiplier", etc.)
 */
export interface StatModifier {
  source: string;
  type: ModifierType;
  value: number;
  target: StatTarget;
}
