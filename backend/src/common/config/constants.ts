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
export const BASE_EPOCH_DURATION = 20;       // Durée de base pour la première époque
export const EPOCH_LOG_BASE = 1.2;           // Base pour la croissance logarithmique
export const LINEAR_ADJUSTMENT_FACTOR = 15;  // Facteur d'ajustement linéaire ajouté à chaque époque
export const EPOCH_OFFSET = 5;                // Décalage fixe à ajouter à chaque durée d'époque (en secondes)


// Constants for Dinosaur Leveling System
export const BASE_EXP_REQUIRED = 100;        // Expérience requise pour passer du niveau 1 au niveau 2
export const EXP_GROWTH_FACTOR = 1.5;         // Facteur de croissance de la progression d'expérience
export const LEVEL_MODIFIER = 2.0; // Ajoute un autre niveau de complexité pour ajustemer finement des valeurs de progression

// Karma system constants
export const KARMA_GAIN_AFTER_DEATH = 100;
