const { 
    BASE_FOOD,
    BASE_ENERGY,
    MIN_FOOD_PER_MEAL,
    MAX_FOOD_PER_MEAL,
    MAX_ENERGY_NO_SLEEP,
    MIN_ENERGY_TO_WAKE_UP,
    ENERGY_COST_TO_EAT
} = require('../config/constants');

/**
 * Génère un nombre aléatoire entre min et max inclus.
 * @param {number} min - La valeur minimale.
 * @param {number} max - La valeur maximale.
 * @returns {number} Un nombre aléatoire entre min et max.
 */
const getRandomInt = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
};

/**
 * Action : Manger
 * Augmente la nourriture du dinosaure d'une quantité aléatoire entre MIN_FOOD_PER_MEAL et MAX_FOOD_PER_MEAL, sans dépasser max_food,
 * et réduit son énergie d'un coût fixe (ENERGY_COST_TO_EAT).
 * @param {Object} dinosaur - Le dinosaure à modifier.
 * @returns {Object} Le dinosaure mis à jour.
 */
const eatDinosaur = (dinosaur) => {
    if (dinosaur.isDead) {
        throw new Error('Le dinosaure est mort et ne peut pas manger.');
    }

    if (dinosaur.isSleeping) {
        throw new Error('Le dinosaure est endormi et ne peut pas manger.');
    }

    if (dinosaur.energy < ENERGY_COST_TO_EAT) {
        throw new Error('Le dinosaure n\'a pas assez d\'énergie pour manger.');
    }

    // Générer une quantité aléatoire de nourriture à ajouter
    const amount = getRandomInt(MIN_FOOD_PER_MEAL, MAX_FOOD_PER_MEAL);
    const newFood = Math.min(dinosaur.food + amount, dinosaur.max_food);
    dinosaur.food = newFood;

    // Réduire l'énergie du dinosaure après avoir mangé
    dinosaur.energy = Math.max(dinosaur.energy - ENERGY_COST_TO_EAT, 0);

    console.log(`Le dinosaure mange. Nourriture passée de ${dinosaur.food - amount} à ${newFood}, énergie réduite à ${dinosaur.energy}.`);
    
    return dinosaur;
};

/**
 * Action : Se mettre en sommeil
 * Met le dinosaure en état de sommeil.
 * @param {Object} dinosaur - Le dinosaure à modifier.
 * @returns {Object} Le dinosaure mis à jour.
 */
const sleepDinosaur = (dinosaur) => {
    if (dinosaur.isDead) {
        throw new Error('Le dinosaure est mort et ne peut pas se mettre en sommeil.');
    }

    if (dinosaur.isSleeping) {
        throw new Error('Le dinosaure est déjà en sommeil.');
    }

    if (dinosaur.energy > MAX_ENERGY_NO_SLEEP) {
        throw new Error(`L'énergie (${dinosaur.energy}) est supérieure à la limite (${BASE_ENERGY}) pour se mettre en sommeil.`);
    }

    dinosaur.isSleeping = true;
    console.log('Le dinosaure est maintenant en sommeil.');
    return dinosaur;
};

/**
 * Action : Se réveiller
 * Met le dinosaure en état éveillé.
 * @param {Object} dinosaur - Le dinosaure à modifier.
 * @returns {Object} Le dinosaure mis à jour.
 */
const wakeDinosaur = (dinosaur) => {
    if (dinosaur.isDead) {
        throw new Error('Le dinosaure est mort et ne peut pas se réveiller.');
    }

    if (!dinosaur.isSleeping) {
        throw new Error('Le dinosaure est déjà éveillé.');
    }

    if (dinosaur.energy < MIN_ENERGY_TO_WAKE_UP) {
        throw new Error(`L'énergie (${dinosaur.energy}) est inférieure à la limite (${MIN_ENERGY_TO_WAKE_UP}) requise pour se réveiller.`);
    }

    dinosaur.isSleeping = false;
    console.log('Le dinosaure s\'est réveillé.');
    return dinosaur;
};

/**
 * Action : Ressusciter
 * Ressuscite un dinosaure mort en réinitialisant ses statistiques.
 * @param {Object} dinosaur - Le dinosaure à ressusciter.
 * @returns {Object} Le dinosaure ressuscité.
 */
const resurrectDinosaur = (dinosaur) => {
    if (!dinosaur.isDead) {
        throw new Error('Le dinosaure n\'est pas mort et ne peut pas être ressuscité.');
    }

    dinosaur.isDead = false;
    dinosaur.isSleeping = false;
    dinosaur.food = BASE_FOOD;
    dinosaur.energy = BASE_ENERGY;
    console.log('Le dinosaure a été ressuscité avec des statistiques réinitialisées.');
    return dinosaur;
};

module.exports = {
    eatDinosaur,
    sleepDinosaur,
    wakeDinosaur,
    resurrectDinosaur
};