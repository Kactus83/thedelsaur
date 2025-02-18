import { StatModifier } from './stats-modifiers.types';

/**
 * Interface représentant un type de dinosaure.
 * Les types sont stockés dans la table `dinosaur_types` et contiennent
 * un ensemble de modificateurs (généralement additifs) appliqués aux caractéristiques de base.
 */
export interface DinosaurType {
  id: number;
  name: string;
  // Tableau de modificateurs appliqués aux statistiques de base
  statModifiers: StatModifier[];
}
