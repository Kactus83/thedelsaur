// Constants for Dinosaur Base Stats
export const BASE_FOOD = 10000;                             // Stock de nourriture initial
export const BASE_ENERGY = 10000;                           // Énergie de départ maximale
export const BASE_MAX_HUNGER = 10000;                       // Niveau maximal de faim

// Energy Consumption and Recovery Rates
export const ENERGY_COST_TO_EAT = 1000;                     // Coût en énergie pour manger
export const ENERGY_DECAY_RATE_PER_SECOND = 5;              // Décroissance de l'énergie par seconde
export const ENERGY_RECOVERY_RATE_PER_SECOND = 150;         // Régénération de l'énergie en sommeil

// Hunger Increase Rates
export const HUNGER_INCREASE_PER_SECOND = 5;                // Augmentation de la faim par seconde
export const HUNGER_INCREASE_PER_SECOND_WHILE_SLEEPING = 1; // Augmentation de la faim par seconde
export const HUNGER_ENERGY_LOSS_RATE_PER_SECOND = 10;       // Perte d'énergie par seconde due à la faim
export const HUNGER_THRESHOLD_BEFORE_ENERGY_LOSS = 8000;    // Seuil de faim au-delà duquel la perte d'énergie commence

// Limits for Sleeping and Waking Conditions
export const MAX_ENERGY_NO_SLEEP = 2500;                    // Seuil d'énergie maximale avant de dormir
export const MIN_ENERGY_TO_WAKE_UP = 7500;                  // Seuil minimum d'énergie pour se réveiller

// Specific Action Costs and Effects
export const ENERGY_COST_TO_GRAZE = 500;                    // Coût énergétique pour l'action de "cueillir"
export const ENERGY_COST_TO_HUNT = 1500;                    // Coût énergétique pour l'action de "chasser"
export const MIN_FOOD_PER_GRAZE = 200;                      // Nourriture minimale obtenue en "cueillant"
export const MAX_FOOD_PER_GRAZE = 500;                      // Nourriture maximale obtenue en "cueillant"
export const MIN_FOOD_PER_HUNT = 800;                       // Nourriture minimale obtenue en "chassant"
export const MAX_FOOD_PER_HUNT = 1500;                      // Nourriture maximale obtenue en "chassant"
