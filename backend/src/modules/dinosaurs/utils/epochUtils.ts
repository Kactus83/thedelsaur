import { Epoch } from '../models/epoch.enum';
import { EPOCH_CONSTANTS } from '../../../common/config/epoch.constants';

/**
 * Calcul des seuils de temps pour chaque époque en fonction de la fonction mathématique.
 * @returns Un tableau de seuils pour chaque époque avec leur temps cumulé.
 */
export function calculateEpochThresholds(): { epoch: Epoch, threshold: number }[] {
    const epochValues = Object.values(Epoch);
    const thresholds = [];
    let cumulativeTime = 0;

    for (let i = 0; i < epochValues.length; i++) {
        // Calcul de la durée de chaque époque selon une courbe progressive
        const normalizedIndex = i / (epochValues.length - 1);
        const epochDuration = EPOCH_CONSTANTS.MIN_EPOCH_DURATION + (EPOCH_CONSTANTS.MAX_EPOCH_DURATION - EPOCH_CONSTANTS.MIN_EPOCH_DURATION) * (1 - Math.exp(-EPOCH_CONSTANTS.CURVE_STEEPNESS * normalizedIndex));
        
        cumulativeTime += epochDuration;

        thresholds.push({
            epoch: epochValues[i],
            threshold: cumulativeTime,
        });
    }

    return thresholds;
}
