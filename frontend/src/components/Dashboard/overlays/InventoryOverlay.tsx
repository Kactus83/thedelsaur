import React, { useState } from 'react';
import './InventoryOverlay.css';
import { Dinosaur } from '../../../types/Dinosaur';
import { purchaseItem, upgradeItem } from '../../../services/shopService';

/**
 * Composant affichant en overlay plein écran l'inventaire du dinosaure.
 * Permet d'acheter et d'améliorer les items via le service du shop.
 * Le composant reçoit le dinosaure entier afin d'avoir accès à ses items et à leurs prix.
 */
interface InventoryOverlayProps {
  dinosaur: Dinosaur;
  onDinosaurUpdate: (dino: Dinosaur) => void;
  onClose: () => void;
  active?: boolean;
}

const InventoryOverlay: React.FC<InventoryOverlayProps> = ({ dinosaur, onDinosaurUpdate, onClose, active = false }) => {
  const [actionMessage, setActionMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!active) return null;

  const handlePurchase = async (itemId: number) => {
    try {
      const result = await purchaseItem(itemId);
      setActionMessage(result.message);
      onDinosaurUpdate(result.dinosaur);
    } catch (error: any) {
      console.error('Erreur achat item:', error);
      setErrorMessage(error.message || "Erreur lors de l’achat de l’item.");
    }
  };

  const handleUpgrade = async (itemId: number) => {
    try {
      const result = await upgradeItem(itemId);
      setActionMessage(result.message);
      onDinosaurUpdate(result.dinosaur);
    } catch (error: any) {
      console.error('Erreur upgrade item:', error);
      setErrorMessage(error.message || "Erreur lors de l’upgrade de l’item.");
    }
  };

  return (
    <div className="overlay active">
      <div className="overlay-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Inventaire</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {actionMessage && <p className="success-message">{actionMessage}</p>}
        <ul className="inventory-list">
          {dinosaur.items.map(item => (
            <li key={item.id} className="inventory-item">
              <h3>{item.name}</h3>
              {item.description && <p>{item.description}</p>}
              <p>Niveau/Quantité : {item.currentLevelOrQuantity}</p>
              {item.itemType && <p>Type : {item.itemType}</p>}
              <p>Prix : {item.price}</p>
              <div className="item-actions">
                <button onClick={() => handlePurchase(item.id)}>Acheter</button>
                {item.price && (
                  <button onClick={() => handleUpgrade(item.id)}>Améliorer</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InventoryOverlay;
