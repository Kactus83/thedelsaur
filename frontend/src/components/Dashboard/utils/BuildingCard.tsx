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
 * Présente : icône, barre de niveaux, nom, description, niveau actuel,
 * et liste d’upgrades avec état et bouton d’achat.
 */
const BuildingCard: React.FC<BuildingCardProps> = ({ building, onUpgrade }) => {
  const { improvementTree = [], purchasedUpgrades = {} } = building;

  return (
    <div className="building-card">
      <div className="building-header">
        <div className="building-icon">🏛️</div>
        <div className="building-progress">
          {Array.from({ length: building.maxLevel }).map((_, i) => (
            <span
              key={i}
              className={
                'level-indicator ' +
                (i < building.currentLevel ? 'achieved' : 'locked')
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
          Niveau : {building.currentLevel} / {building.maxLevel}
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