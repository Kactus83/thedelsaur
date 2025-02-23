import React from 'react';
import './PvpOverlay.css';

interface PvpOverlayProps {
  onClose: () => void;
  active?: boolean;
}

/**
 * Composant affichant un overlay pour le PvP (combats).
 * Reste vide pour le moment.
 */
const PvpOverlay: React.FC<PvpOverlayProps> = ({ onClose, active = false }) => {
  if (!active) return null;

  return (
    <div className="overlay active">
      <div className="overlay-content">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2>PvP</h2>
        <p>Contenu du PvP à venir...</p>
      </div>
    </div>
  );
};

export default PvpOverlay;
