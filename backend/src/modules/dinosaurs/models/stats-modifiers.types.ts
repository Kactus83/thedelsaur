/**
 * Type de modificateur.
 * - 'additive' : la valeur sera ajoutée.
 * - 'multiplicative' : la valeur sera utilisée en multiplication.
 */
export type ModifierType = 'additive' | 'multiplicative';

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
  target: string;
}
