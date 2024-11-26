import { LEVEL_MAX, LEVEL_MAX_HUNGER_MULTIPLIER_CONFIG } from '../../../common/config/constants';


/**
 * Calcule le multiplicateur pour la faim maximale d'un dinosaure en fonction de son niveau.
 * @param level Le niveau du dinosaure.
 * @returns Le multiplicateur de faim maximale ajusté au niveau.
 */
export function calculateMaxHungerMultiplier(level: number): number {
    // Limiter le niveau entre 2 et LEVEL_MAX pour ignorer le niveau 1
    const effectiveLevel = Math.max(2, Math.min(level, LEVEL_MAX));
    const levelRatio = (effectiveLevel - 1) / (LEVEL_MAX - 1);

    // Calculer le multiplicateur pour la faim maximale en utilisant les paramètres de courbe
    const { start, end, curve } = LEVEL_MAX_HUNGER_MULTIPLIER_CONFIG;
    return start + (end - start) * Math.pow(levelRatio, curve);
}
