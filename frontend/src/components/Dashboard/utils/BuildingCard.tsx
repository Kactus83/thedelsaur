import React from 'react';
import { DinosaurBuildingDTO } from '../../../types/dinosaur-building.dto';
import './BuildingCard.css';

interface BuildingCardProps {
  building: DinosaurBuildingDTO & {
    currentLevel: number;
    purchasedUpgrades?: { [upgradeId: string]: boolean };
  };
  onUpgrade: (buildingId: number, upgradeId: number) => void;
}

/**
 * Affiche une carte détaillée pour un bâtiment.
 * L'icône change selon le niveau actuel grâce à un mapping symbolique,
 * et la barre de progression ainsi que les upgrades se mettent à jour
 * dès que `building.currentLevel` change.
 */
const BuildingCard: React.FC<BuildingCardProps> = ({ building, onUpgrade }) => {
  const {
    improvementTree = [],
    purchasedUpgrades = {},
    currentLevel,
    maxLevel
  } = building;

  // Icônes symboliques par palier (1 à 7).
  const levelIcons = ['🏚️','🏠','🏡','🏢','🏰','🏯','🗼'];
  // Assure un niveau au moins à 1, au plus maxLevel
  const safeLevel = Math.max(1, Math.min(currentLevel, maxLevel));
  // Index dans levelIcons (capé à length-1)
  const iconIndex = Math.min(safeLevel - 1, levelIcons.length - 1);
  const buildingIcon = levelIcons[iconIndex] || '🏛️';

  return (
    <div className="building-card">
      <div className="building-header">
        {/* key sur l'icône pour forcer remount à chaque changement de level */}
        <div className="building-icon" key={currentLevel}>
          {buildingIcon}
        </div>
        <div className="building-progress">
          {Array.from({ length: maxLevel }).map((_, i) => (
            <span
              key={i}
              className={
                'level-indicator ' +
                (i < currentLevel ? 'achieved' : 'locked')
              }
            >
              ●
            </span>
          ))}
        </div>
      </div>

      <div className="building-info">
        <h3 className="building-name">{building.name}</h3>
        {building.description && (
          <p className="building-description">{building.description}</p>
        )}
        <p className="building-level">
          Niveau : {currentLevel} / {maxLevel}
        </p>

        <div className="building-upgrades">
          <h4>Upgrades</h4>
          <ul>
            {improvementTree.map(upgrade => {
              const bought = !!purchasedUpgrades[upgrade.id];
              return (
                <li key={upgrade.id} className="upgrade-item">
                  <div className="upgrade-info">
                    <span className="upgrade-name">{upgrade.name}</span>
                    <span className="upgrade-cost">
                      <span className="price-icon">💰</span> Coût : {upgrade.cost}
                    </span>
                  </div>
                  <div className="upgrade-actions">
                    {bought ? (
                      <span className="upgrade-status">Acheté</span>
                    ) : (
                      <button
                        className="upgrade-button"
                        onClick={() => onUpgrade(building.id, upgrade.id)}
                      >
                        Acheter
                      </button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default BuildingCard;