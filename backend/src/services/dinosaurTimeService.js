const { 
    FOOD_DECAY_RATE_PER_SECOND, 
    ENERGY_DECAY_RATE_PER_SECOND 
} = require('../config/constants');

/**
 * Formatte une date pour qu'elle soit compatible avec MySQL TIMESTAMP (sans millisecondes ni fuseau horaire).
 * @param {Date} date - La date à formater.
 * @returns {string} La date formatée pour MySQL.
 */
const formatDateForMySQL = (date) => {
    const pad = (n) => (n < 10 ? '0' + n : n); // Ajoute un zéro devant les valeurs < 10
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
};

/**
 * Service pour ajuster les statistiques d'un dinosaure en fonction du temps écoulé depuis la dernière mise à jour.
 * Les caractéristiques modifiées sont : nourriture (food) et énergie (energy).
 * 
 * @param {Object} dinosaur - Le dinosaure à ajuster.
 * @returns {Object} Le dinosaure avec les statistiques ajustées.
 */
const adjustDinosaurStats = (dinosaur) => {
    // Vérifier que le dinosaure a bien les propriétés nécessaires
    if (!dinosaur || !dinosaur.last_update_by_time_service || dinosaur.food === undefined || dinosaur.energy === undefined) {
        console.error('Les informations du dinosaure sont incomplètes ou invalides.');
        return dinosaur;
    }

    const { last_update_by_time_service, food, energy } = dinosaur;

    try {
        // Convertir les dates et calculer le temps écoulé en secondes
        const lastUpdated = new Date(last_update_by_time_service);
        const now = new Date();
        const timeElapsedInSeconds = Math.floor((now - lastUpdated) / 1000); // Conversion en secondes

        if (timeElapsedInSeconds > 0) {

            // Calcul de la diminution de la nourriture et de l'énergie
            const foodDecay = timeElapsedInSeconds * FOOD_DECAY_RATE_PER_SECOND;
            const energyDecay = timeElapsedInSeconds * ENERGY_DECAY_RATE_PER_SECOND;

            // Mise à jour des statistiques du dinosaure
            dinosaur.food = Math.max(0, food - foodDecay); // La nourriture ne peut pas être négative
            dinosaur.energy = Math.max(0, energy - energyDecay); // L'énergie ne peut pas être négative

            // Formater la date pour MySQL (sans millisecondes ni indicateur de fuseau horaire)
            dinosaur.last_update_by_time_service = formatDateForMySQL(now);

        }

        return dinosaur;

    } catch (error) {
        console.error('Erreur lors de l\'ajustement des statistiques du dinosaure:', error);
        return dinosaur; // Retourne le dinosaure tel quel en cas d'erreur
    }
};

module.exports = {
    adjustDinosaurStats,
};
