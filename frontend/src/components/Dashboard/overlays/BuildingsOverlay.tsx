import React, { useState } from 'react';
import './BuildingsOverlay.css';
import { Dinosaur } from '../../../types/Dinosaur';
import { upgradeBuilding } from '../../../services/shopService';
import BuildingCard from '../utils/BuildingCard';

interface BuildingsOverlayProps {
  dinosaur: Dinosaur;
  onDinosaurUpdate: (dino: Dinosaur) => void;
  onClose: () => void;
  active?: boolean;
}

/**
 * Overlay plein écran pour afficher les bâtiments du dinosaure.
 * Chaque bâtiment est présenté sous forme de carte détaillée avec possibilité d’upgrade.
 */
const BuildingsOverlay: React.FC<BuildingsOverlayProps> = ({ dinosaur, onDinosaurUpdate, onClose, active = false }) => {
  const [actionMessage, setActionMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!active) return null;

  // Handler pour upgrader un bâtiment
  const handleUpgrade = async (buildingId: number, upgradeId: number) => {
    try {
      const result = await upgradeBuilding(buildingId, upgradeId);
      setActionMessage(result.message);
      onDinosaurUpdate(result.dinosaur);
    } catch (error: any) {
      console.error('Erreur upgrade bâtiment:', error);
      setErrorMessage(error.message || "Erreur lors de l’upgrade du bâtiment.");
    }
  };

  return (
    <div className="buildings-overlay">
      <div className="overlay-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Bâtiments</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {actionMessage && <p className="success-message">{actionMessage}</p>}
        <div className="buildings-list">
          {dinosaur.buildings.map(building => (
            <BuildingCard 
              key={building.id} 
              building={building} 
              onUpgrade={handleUpgrade} 
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuildingsOverlay;
