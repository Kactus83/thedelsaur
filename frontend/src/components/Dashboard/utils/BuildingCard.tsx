import React from 'react';
import { DinosaurBuildingDTO } from '../../../types/dinosaur-building.dto';
import './BuildingCard.css';

interface BuildingCardProps {
  /**
   * Le building est un DTO enrichi avec des données d'instance :
   * - currentLevel : niveau actuel du bâtiment.
   * - purchasedUpgrades : objet associant l'ID d'upgrade à un booléen indiquant s'il est acheté.
   */
  building: DinosaurBuildingDTO & { 
    currentLevel: number; 
    purchasedUpgrades?: { [upgradeId: string]: boolean };
  };
  onUpgrade: (buildingId: number, upgradeId: number) => void;
}

/**
 * Affiche une carte détaillée pour un bâtiment.
 * La carte présente l’icône (emoji générique), le nom, la description, le niveau actuel et la liste des upgrades
 * disponibles avec leur état et un bouton pour acheter les upgrades non achetés.
 */
const BuildingCard: React.FC<BuildingCardProps> = ({ building, onUpgrade }) => {
  // On s'assure que improvementTree est un tableau (même vide) et purchasedUpgrades est un objet.
  console.log(building);
  const improvementTree = building.improvementTree || [];
  const purchasedUpgrades = building.purchasedUpgrades || {};

  return (
    <div className="building-card">
      <div className="building-icon">🏛️</div>
      <div className="building-info">
        <h3 className="building-name">{building.name}</h3>
        {building.description && <p className="building-description">{building.description}</p>}
        <p className="building-level">Niveau : {building.currentLevel} / {building.maxLevel}</p>
        <div className="building-upgrades">
          <h4>Upgrades</h4>
          <ul>
            {improvementTree.map((upgrade) => {
              const purchased = purchasedUpgrades[upgrade.id] || false;
              return (
                <li key={upgrade.id} className="upgrade-item">
                  <div className="upgrade-info">
                    <span className="upgrade-name">{upgrade.name}</span>
                    <span className="upgrade-cost">Coût : {upgrade.cost}</span>
                  </div>
                  <div className="upgrade-actions">
                    {purchased ? (
                      <span className="upgrade-status">Acheté</span>
                    ) : (
                      <button className="upgrade-button" onClick={() => onUpgrade(building.id, upgrade.id)}>
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
