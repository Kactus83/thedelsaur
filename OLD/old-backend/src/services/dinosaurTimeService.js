const { 
    FOOD_DECAY_RATE_PER_SECOND, 
    ENERGY_DECAY_RATE_PER_SECOND,
    ENERGY_RECOVERY_RATE_PER_SECOND
} = require('../config/constants');

/**
 * Service pour ajuster les statistiques d'un dinosaure en fonction du temps écoulé depuis la dernière mise à jour.
 * Les caractéristiques modifiées sont : nourriture (food) et énergie (energy).
 * Prend en compte les états `isDead` et `isSleeping`.
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

    // Si le dinosaure est mort, les stats doivent être à zéro et rien n'évolue
    if (dinosaur.isDead) {
        console.log('Le dinosaure est mort. Les stats sont mises à zéro.');
        dinosaur.food = 0;
        dinosaur.energy = 0;
        return dinosaur;
    }

    const { last_update_by_time_service, food, energy, isSleeping } = dinosaur;

    try {
        // Convertir les dates et calculer le temps écoulé en secondes
        const lastUpdated = new Date(last_update_by_time_service);
        const now = new Date();
        const timeElapsedInSeconds = Math.floor((now - lastUpdated) / 1000); // Conversion en secondes

        if (timeElapsedInSeconds > 0) {

            if (isSleeping) {
                // Si le dinosaure dort :
                // La nourriture ne diminue pas
                // L'énergie augmente selon une constante
                const energyRecovery = timeElapsedInSeconds * ENERGY_RECOVERY_RATE_PER_SECOND;
                dinosaur.energy = Math.min(dinosaur.max_energy, energy + energyRecovery); // L'énergie ne dépasse pas le maximum
            } else {
                // Si le dinosaure est éveillé :
                // La nourriture et l'énergie diminuent selon les taux de déclin
                const foodDecay = timeElapsedInSeconds * FOOD_DECAY_RATE_PER_SECOND;
                const energyDecay = timeElapsedInSeconds * ENERGY_DECAY_RATE_PER_SECOND;

                dinosaur.food = Math.max(0, food - foodDecay); // La nourriture ne peut pas être négative
                dinosaur.energy = Math.max(0, energy - energyDecay); // L'énergie ne peut pas être négative
            }

            // Vérifier les conditions pour changer les états
            if (dinosaur.food === 0 && !dinosaur.isDead) {
                dinosaur.isDead = true;
                dinosaur.energy = 0; // Assurer que l'énergie est à zéro
            }

            if (dinosaur.energy === 0 && !dinosaur.isSleeping && !dinosaur.isDead) {
                dinosaur.isSleeping = true;
            }

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
