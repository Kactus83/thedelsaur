import { StatModifier } from './stats-modifiers.types';

/**
 * Interface représentant le niveau d'un objet pour un dinosaure.
 * Chaque niveau définit des modificateurs spécifiques qui s'appliquent.
 */
export interface DinosaurItemLevel {
  /**
   * Niveau spécifique de l'objet.
   */
  level: number;

  /**
   * Tableau de modificateurs qui s'appliquent à ce niveau.
   */
  statModifiers: StatModifier[];
}

/**
 * Interface représentant un objet utilisable par un dinosaure.
 * Les objets sont achetés avec de l'argent et nécessitent un niveau minimum pour être acquis.
 * Ils peuvent être améliorés jusqu'à un niveau maximum, chaque niveau offrant des modificateurs différents.
 */
export interface DinosaurItem {
  /**
   * Identifiant unique de l'objet.
   */
  id: number;

  /**
   * Nom de l'objet.
   */
  name: string;

  /**
   * Description optionnelle de l'objet.
   */
  description?: string;

  /**
   * Prix en argent requis pour acheter cet objet.
   */
  price: number;

  /**
   * Niveau minimum du dinosaure requis pour acheter cet objet.
   */
  minLevelToBuy: number;

  /**
   * Niveau actuel de l'objet (correspondant à son amélioration).
   */
  currentLevel: number;

  /**
   * Niveau maximum que l'objet peut atteindre.
   */
  maxLevel: number;

  /**
   * Définition des modificateurs pour chaque niveau de l'objet.
   */
  // utiliser un maping ici ne serai pas plus elegant ?
  levels: DinosaurItemLevel[];
}
