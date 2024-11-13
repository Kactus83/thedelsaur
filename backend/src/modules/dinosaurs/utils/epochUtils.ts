import { Epoch } from '../models/epoch.enum';
import { MIN_EPOCH_DURATION, MAX_EPOCH_DURATION, CURVE_STEEPNESS } from '../../../common/config/constants';

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
        const epochDuration = MIN_EPOCH_DURATION + (MAX_EPOCH_DURATION - MIN_EPOCH_DURATION) * (1 - Math.exp(-CURVE_STEEPNESS * normalizedIndex));
        
        cumulativeTime += epochDuration;

        thresholds.push({
            epoch: epochValues[i],
            threshold: cumulativeTime,
        });
    }

    return thresholds;
}
