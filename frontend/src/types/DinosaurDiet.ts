import { StatModifier } from './stats-modifiers.types';

/**
 * Interface représentant une diète de dinosaure.
 * Les diètes sont stockées dans la table `dinosaur_diets` et contiennent
 * un ensemble de modificateurs (généralement additifs) appliqués aux earn multipliers.
 */
export interface DinosaurDiet {
  id: number;
  name: string;
  // Tableau de modificateurs pour ajuster les earn multipliers
  statModifiers: StatModifier[];
}
