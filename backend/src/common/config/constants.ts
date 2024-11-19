import { DinosaurMultiplier } from "../../modules/dinosaurs/models/dinosaur-multiplier.interface";

// Constants for Dinosaur Base Stats
export const BASE_FOOD = 5000;                             // Stock de nourriture initial
export const MAX_FOOD = 10000;
export const BASE_ENERGY = 10000;  
export const MAX_ENERGY = 10000;                           // Énergie de départ maximale
export const BASE_MAX_HUNGER = 10000;                       // Niveau maximal de faim

// Energy Consumption and Recovery Rates
export const ENERGY_COST_TO_DISCOVER = 2500;                // Coût en énergie pour découvrir
export const ENERGY_DECAY_RATE_PER_SECOND = 50;              // Décroissance de l'énergie par seconde
export const ENERGY_RECOVERY_RATE_PER_SECOND = 500;         // Régénération de l'énergie en sommeil

// Hunger Increase Rates
export const HUNGER_INCREASE_PER_SECOND = 15;                // Augmentation de la faim par seconde
export const HUNGER_INCREASE_PER_SECOND_WHILE_SLEEPING = 500; // Augmentation de la faim par seconde
export const HUNGER_ENERGY_LOSS_RATE_PER_SECOND = 10;       // Perte d'énergie par seconde due à la faim
export const HUNGER_THRESHOLD_BEFORE_ENERGY_LOSS = 7000;    // Seuil de faim au-delà duquel la perte d'énergie commence

// Limits for Sleeping and Waking Conditions
export const MAX_ENERGY_NO_SLEEP = MAX_ENERGY / 4;                    // Seuil d'énergie maximale avant de dormir
export const MIN_ENERGY_TO_WAKE_UP = MAX_ENERGY / 2;                  // Seuil minimum d'énergie pour se réveiller

// Specific Action Costs and Effects
export const ENERGY_COST_TO_GRAZE = 1500;                    // Coût énergétique pour l'action de "cueillir"
export const ENERGY_COST_TO_HUNT = 2500;                    // Coût énergétique pour l'action de "chasser"
export const ENERGY_COST_TO_STEAL = 2000;                   // Coût énergétique pour l'action de "voler"

// Epoch thresholds 
export const MIN_EPOCH_DURATION = 20;      // Durée minimale de chaque palier
export const MAX_EPOCH_DURATION = 120;     // Durée maximale que chaque palier tend à atteindre
export const CURVE_STEEPNESS = 1.5;        // Facteur de contrôle pour la progression de la courbe


// Constants for Dinosaur Leveling System
export const BASE_EXP_REQUIRED = 100;               // Expérience requise pour passer du niveau 1 au niveau 2
export const EXP_GROWTH_FACTOR = 1.5;               // Facteur de croissance de la progression d'expérience
export const LEVEL_MODIFIER = 2.0;                  // Ajoute un autre niveau de complexité pour ajustemer finement des valeurs de progression
export const LEVEL_MAX = 100;                       // Niveau maximum où l'influence est effective

export const LEVEL_MULTIPLIER_CONFIG: Record<keyof DinosaurMultiplier, { start: number, end: number, curve: number }> = {
    earn_herbi_food_multiplier: { start: 1.0, end: 1.0, curve: 1 },
    earn_carni_food_multiplier: { start: 1.0, end: 1.0, curve: 1 },
    earn_food_multiplier: { start: 1.0, end: 40.0, curve: 0.8 },
    earn_energy_multiplier: { start: 1.0, end: 40.0, curve: 0.8 },
    earn_experience_multiplier: { start: 1.0, end: 1.0, curve: 1 },
    max_energy_multiplier: { start: 1.0, end: 40.0, curve: 0.8 },
    max_food_multiplier: { start: 1.0, end: 50.0, curve: 0.8 },
};
export const LEVEL_HUNGER_MULTIPLIER_CONFIG = {
    start: 1.0,  // Début du multiplicateur de faim
    end: 50.0,   // Fin du multiplicateur de faim
    curve: 0.8,  // Facteur de courbe pour contrôler l'évolution
};

export const LEVEL_MAX_HUNGER_MULTIPLIER_CONFIG = {
    start: 1.0,  // Valeur de départ du multiplicateur de faim maximale
    end: 20.0,    // Valeur finale du multiplicateur de faim maximale
    curve: 0.8,  // Facteur de courbe pour ajuster la progression
};

// Karma system constants
export const KARMA_GAIN_AFTER_DEATH = 100;
