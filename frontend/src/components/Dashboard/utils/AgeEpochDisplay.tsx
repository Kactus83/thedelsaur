import React from 'react';
import './AgeEpochDisplay.css';
import { Dinosaur } from '../../../types/Dinosaur';
import { useOverlay } from '../../../contexts/OverlayContext';
import { ClickableStatTarget } from '../../../types/ClickableStatTarget';

interface AgeEpochDisplayProps {
  dinosaur: Dinosaur;
}

/**
 * Composant unique qui affiche l'âge et l'époque du dinosaure de manière moderne et intuitive.
 * 
 * - L'âge est calculé et formaté selon la durée écoulée depuis la dernière renaissance :
 *   • Moins d'une minute : affichage des secondes.
 *   • Moins d'une heure : minutes et secondes.
 *   • Moins d'un jour : heures et minutes.
 *   • Moins d'une année : jours et heures.
 *   • Sinon : années et jours.
 * 
 * - L'époque est représentée par une jauge animée. On extrait le nom et le niveau à partir de la valeur
 *   de l'époque (format "NomEpoch_EpochN"). Le remplissage de la barre est proportionnel au niveau (sur 4),
 *   et le header affiche le nom de l'époque et le niveau.
 * 
 * Des triggers overlay sont associés pour permettre d'afficher des détails complémentaires :
 * - En cliquant sur l'âge, on affiche le détail associé à AGE.
 * - En cliquant sur le nom de l'époque, on affiche le détail EPOCH_LABEL.
 * - En cliquant sur la barre, on affiche le détail EPOCH_BAR.
 */
const AgeEpochDisplay: React.FC<AgeEpochDisplayProps> = ({ dinosaur }) => {
  const { openStatDetail } = useOverlay();

  // Calcul "friendly" de l'âge
  const formatAge = (lastReborn: Date): string => {
    const now = new Date().getTime();
    const diffMs = now - new Date(lastReborn).getTime();
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const years = Math.floor(days / 365);

    if (years > 0) {
      const remainingDays = days % 365;
      return `${years} an${years > 1 ? 's' : ''} ${remainingDays} j`;
    } else if (days > 0) {
      const remainingHours = hours % 24;
      return `${days} j ${remainingHours} h`;
    } else if (hours > 0) {
      const remainingMinutes = minutes % 60;
      return `${hours} h ${remainingMinutes} min`;
    } else if (minutes > 0) {
      const remainingSeconds = seconds % 60;
      return `${minutes} min ${remainingSeconds} sec`;
    } else {
      return `${seconds} sec`;
    }
  };

  // Extraction du nom et du niveau d'époque à partir du string (exemple : "Ancient_Epoch3")
  const parseEpoch = (epoch: string) => {
    const [epochName, epochLevelStr] = epoch.split('_Epoch');
    const epochLevel = parseInt(epochLevelStr, 10);
    const maxLevel = 4;
    const percentage = (epochLevel / maxLevel) * 100;
    return { epochName, epochLevel, maxLevel, percentage };
  };

  const ageText = formatAge(dinosaur.last_reborn);
  const { epochName, epochLevel, maxLevel, percentage } = parseEpoch(dinosaur.epoch);

  return (
    <div className="age-epoch-display">
      {/* Affichage de l'âge avec trigger overlay */}
      <div className="age-container" onClick={() => openStatDetail(ClickableStatTarget.AGE)}>
        <div className="age-label">Âge : {ageText}</div>
      </div>

      {/* Affichage de la jauge d'époque */}
      <div className="epoch-container">
        <div className="epoch-header" onClick={() => openStatDetail(ClickableStatTarget.EPOCH_LABEL)}>
          <span className="epoch-name">{epochName}</span><br/>
          <span className="epoch-level">{`Époque ${epochLevel} / ${maxLevel}`}</span>
        </div>
        <div className="epoch-bar" onClick={() => openStatDetail(ClickableStatTarget.EPOCH_BAR)}>
          <div className="epoch-fill" style={{ width: `${percentage}%` }} />
        </div>
      </div>
    </div>
  );
};

export default AgeEpochDisplay;
