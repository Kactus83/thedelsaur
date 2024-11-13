import { LEVEL_MULTIPLIER_CONFIG, LEVEL_MAX, LEVEL_MAX_HUNGER_MULTIPLIER_CONFIG } from '../../../common/config/constants';
import { DietTypeMultipliers } from '../libs/multipliers/dinosaur-diet-multipliers';
import { DinosaurTypeMultipliers } from '../libs/multipliers/dinosaur-type-multipliers';
import { DietType } from '../models/dinosaur-diet.type';
import { DinosaurMultiplier } from '../models/dinosaur-multiplier.interface';
import { DinosaurType } from '../models/dinosaur-type.type';

/**
 * Calcule les multiplicateurs finaux pour un dinosaure en fonction de son régime alimentaire, de son type et de son niveau.
 * @param dietType Le type de régime alimentaire du dinosaure (omnivore, carnivore, herbivore).
 * @param dinoType Le type de dinosaure (land, air, sea).
 * @param level Le niveau du dinosaure.
 * @returns Les multiplicateurs finaux arrondis à 0.01 près.
 */
export function calculateFinalMultipliers(dietType: DietType, dinoType: DinosaurType, level: number): DinosaurMultiplier {
    // Limiter le niveau entre 1 et LEVEL_MAX et ignorer les évolutions au niveau 1
    const effectiveLevel = Math.max(1, Math.min(level, LEVEL_MAX));
    const levelRatio = effectiveLevel >= 1 ? (effectiveLevel - 1) / (LEVEL_MAX - 1) : 0;

    // Initialiser les multiplicateurs de base
    const baseMultipliers: DinosaurMultiplier = {
        earn_herbi_food_multiplier: 1,
        earn_carni_food_multiplier: 1,
        earn_food_multiplier: 1,
        earn_energy_multiplier: 1,
        earn_experience_multiplier: 1,
        max_energy_multiplier: 1,
        max_food_multiplier: 1,
    };

    // Appliquer les multiplicateurs du type de régime alimentaire
    const dietMultipliers = DietTypeMultipliers[dietType];
    for (const key in dietMultipliers) {
        if (dietMultipliers.hasOwnProperty(key)) {
            baseMultipliers[key as keyof DinosaurMultiplier] *= dietMultipliers[key as keyof DinosaurMultiplier] || 1;
        }
    }
    
    // Appliquer les multiplicateurs du type de dinosaure
    const typeMultipliers = DinosaurTypeMultipliers[dinoType];
    for (const key in typeMultipliers) {
        if (typeMultipliers.hasOwnProperty(key)) {
            baseMultipliers[key as keyof DinosaurMultiplier] *= typeMultipliers[key as keyof DinosaurMultiplier] || 1;
        }
    }
    
    // Appliquer les multiplicateurs basés sur le niveau à partir du niveau 2
    for (const key in LEVEL_MULTIPLIER_CONFIG) {
        if (LEVEL_MULTIPLIER_CONFIG.hasOwnProperty(key)) {
            const config = LEVEL_MULTIPLIER_CONFIG[key as keyof DinosaurMultiplier];
            const multiplierProgression = config.start + (config.end - config.start) * Math.pow(levelRatio, config.curve);
            baseMultipliers[key as keyof DinosaurMultiplier] *= multiplierProgression;
        }
    }
    
    // Arrondir les multiplicateurs finaux à deux décimales
    for (const key in baseMultipliers) {
        baseMultipliers[key as keyof DinosaurMultiplier] = parseFloat(baseMultipliers[key as keyof DinosaurMultiplier].toFixed(2));
    }

    return baseMultipliers;
}

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
