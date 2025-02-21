import React from 'react';
import { DinosaurBuildingDTO } from '../../../types/dinosaur-building.dto';
import './ShopCard.css';

interface ShopBuildingCardProps {
  building: DinosaurBuildingDTO;
  onPurchase: (buildingId: number) => void;
  onUpgrade: (buildingId: number, upgradeId: number) => void;
  preview?: boolean;
  disabled?: boolean;
  insufficientResources?: boolean;
}

const ShopBuildingCard: React.FC<ShopBuildingCardProps> = ({
  building,
  onPurchase,
  onUpgrade,
  preview = false,
  disabled = false,
  insufficientResources = false,
}) => {
  return (
    <div className="shop-card">
      <div className="shop-card-image" style={{ fontSize: '3rem' }}>
        {/* Placeholder emoji pour les bâtiments */}
        🏛️
      </div>
      <div className="shop-card-content">
        <h3>{building.name}</h3>
        <p>{building.description}</p>
        <p className="shop-card-price">Prix : {building.price}</p>
        <p className="shop-card-minlevel">Niveau min : {building.minLevelToBuy}</p>
        <div className="shop-card-actions">
          {preview ? (
            <button className="shop-card-btn" disabled>
              Prochain niveau
            </button>
          ) : (
            <button
              className="shop-card-btn"
              disabled={disabled || insufficientResources}
              onClick={() => onPurchase(building.id)}
            >
              {insufficientResources ? "Pas assez d'argent" : "Acheter"}
            </button>
          )}
          {!preview && (
            <button
              className="shop-card-btn upgrade"
              disabled={disabled || insufficientResources}
              onClick={() => onUpgrade(building.id, 1)}
            >
              {insufficientResources ? "Pas assez d'argent" : "Upgrade"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopBuildingCard;
