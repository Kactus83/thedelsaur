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

  // Onglets : 'consumable' pour consommables, 'persistent' pour persistants
  const [selectedTab, setSelectedTab] = useState<'consumable' | 'persistent'>('consumable');

  // Filtrer les items selon le type sélectionné
  const filteredItems = dinosaur.items.filter(item => item.itemType === selectedTab);

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
        <header>
          <h2>Inventaire</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </header>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {actionMessage && <p className="success-message">{actionMessage}</p>}

        <div className="inventory-submenu">
          <nav className="inventory-tabs">
            <button
              className={selectedTab === 'consumable' ? 'active' : ''}
              onClick={() => setSelectedTab('consumable')}
            >
              Consommables
            </button>
            <button
              className={selectedTab === 'persistent' ? 'active' : ''}
              onClick={() => setSelectedTab('persistent')}
            >
              Persistents
            </button>
          </nav>
        </div>

        <ul className="inventory-list">
          {filteredItems.map(item => (
            <li key={item.id} className="inventory-item">
              <h3>{item.name}</h3>
              {item.description && <p>{item.description}</p>}

              {item.itemType === 'consumable' ? (
                <>
                  <p>Quantité : {item.currentLevelOrQuantity}</p>
                  <p>Prix unitaire : {item.price}</p>
                  <div className="item-actions">
                    <button onClick={() => handlePurchase(item.id)}>Acheter</button>
                  </div>
                </>
              ) : (
                <>
                  <p>Niveau actuel : {item.currentLevelOrQuantity}</p>
                  {(() => {
                    const nextLevel = item.currentLevelOrQuantity + 1;
                    const nextDef = item.levels.find(l => l.level === nextLevel);
                    if (nextDef) {
                      return (
                        <>
                          <p>Prochain niveau ({nextLevel}) – Prix : {nextDef.price}</p>
                          <div className="item-actions">
                            <button onClick={() => handleUpgrade(item.id)}>Améliorer</button>
                          </div>
                        </>
                      );
                    }
                    return <p>Niveau maximum atteint</p>;
                  })()}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default InventoryOverlay;