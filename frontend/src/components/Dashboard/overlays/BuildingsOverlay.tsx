import React, { useState } from 'react';
import './BuildingsOverlay.css';
import { Dinosaur } from '../../../types/Dinosaur';
import { upgradeBuilding } from '../../../services/shopService';

/**
 * Composant affichant en overlay plein écran la liste des bâtiments du dinosaure.
 * Permet d'améliorer les bâtiments via le service du shop.
 * Le composant reçoit le dinosaure entier afin d'accéder à la liste de ses bâtiments.
 */
interface BuildingsOverlayProps {
  dinosaur: Dinosaur;
  onDinosaurUpdate: (dino: Dinosaur) => void;
  onClose: () => void;
  active?: boolean;
}

const BuildingsOverlay: React.FC<BuildingsOverlayProps> = ({ dinosaur, onDinosaurUpdate, onClose, active = false }) => {
  const [actionMessage, setActionMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!active) return null;

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
    <div className="overlay active">
      <div className="overlay-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Bâtiments</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {actionMessage && <p className="success-message">{actionMessage}</p>}
        <ul className="buildings-list">
          {dinosaur.buildings.map(building => (
            <li key={building.id} className="building-item">
              <h3>{building.name}</h3>
              {building.description && <p>{building.description}</p>}
              <p>Niveau actuel : {building.currentLevel}</p>
              <div className="building-upgrades">
                <strong>Upgrades :</strong>
                <ul>
                  {Object.entries(building.purchasedUpgrades).map(([upgradeId, purchased]) => (
                    <li key={upgradeId}>
                      Upgrade {upgradeId} : {purchased ? 'Acheté' : 'Non acheté'}
                      {!purchased && (
                        <button onClick={() => handleUpgrade(building.id, Number(upgradeId))}>
                          Acheter Upgrade
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default BuildingsOverlay;
