import React from 'react';
import { DinosaurBuildingDTO } from '../../../../../types/dinosaur-building.dto';
import './ShopCard.css';

interface ShopBuildingCardProps {
  building: DinosaurBuildingDTO;
  onPurchase: (buildingId: number) => void;
  onUpgrade?: (buildingId: number, upgradeId: number) => void;
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
        🏛️
      </div>
      <div className="shop-card-content">
        <div>
          <h3>{building.name}</h3>
          <p>{building.description}</p>
        </div>
        <div>
          <p className="shop-card-price">
            <span className="price-icon">💰</span>
            Prix : {building.price}
          </p>
          <p className="shop-card-minlevel">
            Niveau min : {building.minLevelToBuy}
          </p>
        </div>
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
        </div>
      </div>
    </div>
  );
};

export default ShopBuildingCard;