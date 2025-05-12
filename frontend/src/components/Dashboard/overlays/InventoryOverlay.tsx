import React, { useState } from 'react';
import './InventoryOverlay.css';
import { Dinosaur } from '../../../types/Dinosaur';
import { purchaseItem, upgradeItem } from '../../../services/shopService';

interface InventoryOverlayProps {
  dinosaur: Dinosaur;
  onDinosaurUpdate: (dino: Dinosaur) => void;
  onClose: () => void;
  active?: boolean;
}

/**
 * Overlay plein écran pour afficher l'inventaire du dinosaure.
 * Onglets pour consommables vs persistants, achat et upgrade.
 */
const InventoryOverlay: React.FC<InventoryOverlayProps> = ({
  dinosaur,
  onDinosaurUpdate,
  onClose,
  active = false,
}) => {
  const [actionMessage, setActionMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [selectedTab, setSelectedTab] = useState<'consumable' | 'persistent'>('consumable');

  if (!active) return null;

  const filteredItems = dinosaur.items.filter(item => item.itemType === selectedTab);

  const handlePurchase = async (itemId: number) => {
    try {
      const result = await purchaseItem(itemId);
      setActionMessage(result.message);
      onDinosaurUpdate(result.dinosaur);
    } catch (error: any) {
      setErrorMessage(error.message || 'Erreur lors de l’achat de l’item.');
    }
  };

  const handleUpgrade = async (itemId: number) => {
    try {
      const result = await upgradeItem(itemId);
      setActionMessage(result.message);
      onDinosaurUpdate(result.dinosaur);
    } catch (error: any) {
      setErrorMessage(error.message || 'Erreur lors de l’upgrade de l’item.');
    }
  };

  return (
    <div className="inventory-overlay active">
      <div className="inventory-overlay-content">
        <header className="inventory-header">
          <h2>Inventaire</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </header>

        <div className="build-messages">
          {errorMessage && <p className="error-message">{errorMessage}</p>}
          {actionMessage && <p className="success-message">{actionMessage}</p>}
        </div>

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
              Persistants
            </button>
          </nav>
        </div>

        <div className="inventory-grid">
          {filteredItems.map(item => {
            const icon = item.itemType === 'consumable' ? '🍎' : '⚙️';
            const ownedQty = item.currentLevelOrQuantity;
            return (
              <div key={item.id} className="inventory-card">
                <div className="inventory-card-image">{icon}</div>
                <div className="inventory-card-content">
                  <h3>{item.name}</h3>
                  {item.description && <p>{item.description}</p>}

                  {item.itemType === 'consumable' ? (
                    <>
                      <p>Quantité : {ownedQty}</p>
                      <div className="price-row">
                        <span className="price-icon">💰</span>
                        <span>Prix : {item.price}</span>
                      </div>
                      <div className="inventory-card-actions">
                        <button
                          className="inventory-btn"
                          onClick={() => handlePurchase(item.id)}
                        >
                          Acheter
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p>Niveau : {ownedQty}</p>
                      {(() => {
                        const nextLevel = ownedQty + 1;
                        const nextDef = item.levels.find(l => l.level === nextLevel);
                        if (nextDef) {
                          return (
                            <>
                              <div className="price-row">
                                <span className="price-icon">💰</span>
                                <span>
                                  Niveau {nextLevel} – Prix : {nextDef.price}
                                </span>
                              </div>
                              <div className="inventory-card-actions">
                                <button
                                  className="inventory-btn upgrade"
                                  onClick={() => handleUpgrade(item.id)}
                                >
                                  Améliorer
                                </button>
                              </div>
                            </>
                          );
                        }
                        return <p>Niveau max atteint</p>;
                      })()}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default InventoryOverlay;