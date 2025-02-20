import React from 'react';
import './InventoryOverlay.css';
import { DinosaurItemInstanceDTO } from '../../../types/dinosaur-item-instance.dto';

interface InventoryOverlayProps {
  items: DinosaurItemInstanceDTO[];
  onClose: () => void;
}

/**
 * Composant affichant en overlay plein écran la liste des items du dinosaure.
 */
const InventoryOverlay: React.FC<InventoryOverlayProps> = ({ items, onClose }) => {
  return (
    <div className="overlay">
      <div className="overlay-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Inventaire</h2>
        <ul className="inventory-list">
          {items.map(item => (
            <li key={item.id} className="inventory-item">
              <h3>{item.name}</h3>
              {item.description && <p>{item.description}</p>}
              <p>Niveau/Quantité : {item.currentLevelOrQuantity}</p>
              {item.itemType && <p>Type : {item.itemType}</p>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InventoryOverlay;
