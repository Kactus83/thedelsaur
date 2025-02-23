import React from 'react';
import { DinosaurItemDTO } from '../../../types/dinosaur-item.dto';
import './ShopCard.css';

interface ShopItemCardProps {
  item: DinosaurItemDTO;
  onPurchase: (itemId: number) => void;
  onUpgrade?: (itemId: number) => void;
  preview?: boolean;
  disabled?: boolean;
  insufficientResources?: boolean;
  ownedQuantity?: number;
}

const ShopItemCard: React.FC<ShopItemCardProps> = ({
  item,
  onPurchase,
  onUpgrade,
  preview = false,
  disabled = false,
  insufficientResources = false,
  ownedQuantity = 0,
}) => {
  return (
    <div className="shop-card">
      <div className="shop-card-image" style={{ fontSize: '3rem' }}>
        {/* Placeholder emoji pour les items */}
        🎒
      </div>
      <div className="shop-card-content">
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <p className="shop-card-price">Prix : {item.price}</p>
        <p className="shop-card-minlevel">Niveau min : {item.minLevelToBuy}</p>
        {ownedQuantity > 0 && (
          <p className="shop-card-owned">Possédé : {ownedQuantity}</p>
        )}
        <div className="shop-card-actions">
          {preview ? (
            <button className="shop-card-btn" disabled>
              Prochain niveau
            </button>
          ) : (
            <button
              className="shop-card-btn"
              disabled={disabled || insufficientResources}
              onClick={() => onPurchase(item.id)}
            >
              {insufficientResources ? "Pas assez d'argent" : "Acheter"}
            </button>
          )}
          {item.itemType === 'persistent' && onUpgrade && !preview && (
            <button
              className="shop-card-btn upgrade"
              disabled={disabled || insufficientResources}
              onClick={() => onUpgrade(item.id)}
            >
              {insufficientResources ? "Pas assez d'argent" : "Upgrade"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopItemCard;