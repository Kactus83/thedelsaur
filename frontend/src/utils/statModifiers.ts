import { Dinosaur } from '../types/Dinosaur';
import { StatModifier, StatTarget } from '../types/stats-modifiers.types';

/**
 * Retourne tous les modifiers du dinosaure qui ciblent une statistique donnée.
 * @param dinosaur Le dinosaure dont on veut extraire les modifiers.
 * @param target La statistique cible.
 * @returns Un tableau de modifiers applicables à la statistique.
 */
export function getModifiersForStat(dinosaur: Dinosaur, target: StatTarget): StatModifier[] {
    return dinosaur.stats_modifiers.filter(mod => mod.target === target);
}
