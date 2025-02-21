// src/components/Dashboard/overlays/BuildingsOverlay.tsx
import React from 'react';
import './BuildingsOverlay.css';
import { DinosaurBuildingInstanceDTO } from '../../../types/dinosaur-building-instance.dto';

interface BuildingsOverlayProps {
  buildings: DinosaurBuildingInstanceDTO[];
  onClose: () => void;
  active?: boolean;
}

/**
 * Composant affichant en overlay plein écran la liste des bâtiments du dinosaure.
 * Il ne rend rien si "active" n'est pas vrai.
 */
const BuildingsOverlay: React.FC<BuildingsOverlayProps> = ({ buildings, onClose, active = false }) => {
  if (!active) return null;
  return (
    <div className="overlay active">
      <div className="overlay-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Bâtiments</h2>
        <ul className="buildings-list">
          {buildings.map(building => (
            <li key={building.id} className="building-item">
              <h3>{building.name}</h3>
              {building.description && <p>{building.description}</p>}
              <p>Niveau actuel : {building.currentLevel}</p>
              <div>
                <strong>Upgrades :</strong>
                <ul>
                  {Object.entries(building.purchasedUpgrades).map(([upgradeId, purchased]) => (
                    <li key={upgradeId}>
                      Upgrade {upgradeId} : {purchased ? 'Acheté' : 'Non acheté'}
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
