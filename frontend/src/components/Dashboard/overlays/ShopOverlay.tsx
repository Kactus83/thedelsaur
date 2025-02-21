import React, { useEffect, useState } from 'react';
import { 
  fetchShopAssets, 
  purchaseSkill, 
  purchaseItem, 
  upgradeItem, 
  purchaseBuilding, 
  upgradeBuilding 
} from '../../../services/shopService';
import { ShopAssetsDTO } from '../../../types/shop-assets.dto';
import { Dinosaur } from '../../../types/Dinosaur';
import { useOverlay } from '../../../contexts/OverlayContext';
import ShopSkillCard from '../../Dashboard/utils/ShopSkillCard';
import ShopItemCard from '../../Dashboard/utils/ShopItemCard';
import ShopBuildingCard from '../../Dashboard/utils/ShopBuildingCard';
import './ShopOverlay.css';

interface ShopOverlayProps {
  onDinosaurUpdate?: (dino: Dinosaur) => void;
  active?: boolean;
  dinosaur: Dinosaur;
}

const ShopOverlay: React.FC<ShopOverlayProps> = ({ onDinosaurUpdate, active = false, dinosaur }) => {
  const [assets, setAssets] = useState<ShopAssetsDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionMessage, setActionMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { closeOverlay } = useOverlay();
  const [selectedTab, setSelectedTab] = useState<'skills' | 'items' | 'buildings'>('skills');

  useEffect(() => {
    const loadAssets = async () => {
      try {
        const data = await fetchShopAssets();
        setAssets(data);
      } catch (error) {
        console.error('Erreur lors du chargement des assets du shop:', error);
        setErrorMessage("Erreur lors du chargement des assets.");
      } finally {
        setLoading(false);
      }
    };
    loadAssets();
  }, []);

  // Filtrage : on n'affiche que les assets dont le niveau minimum est <= (dino.level + 1).
  // Pour les skills, on exclut celles déjà achetées.
  const filterAssets = <T extends { minLevelToBuy: number }>(list: T[], alreadyOwned: (id: number) => boolean) => {
    const available = list.filter(asset => asset.minLevelToBuy <= dinosaur.level && !alreadyOwned((asset as any).id));
    const preview = list.filter(asset => asset.minLevelToBuy === dinosaur.level + 1);
    return { available, preview };
  };

  // Pour les skills, détermine si déjà achetée
  const isSkillOwned = (skillId: number): boolean => {
    return dinosaur.skills.some(s => s.id === skillId && s.isPurchased);
  };

  // Pour les items et bâtiments, on laisse éventuellement afficher même si déjà acquis (pour upgrade)
  const filterGeneric = <T extends { minLevelToBuy: number }>(list: T[]) => {
    const available = list.filter(asset => asset.minLevelToBuy <= dinosaur.level);
    const preview = list.filter(asset => asset.minLevelToBuy === dinosaur.level + 1);
    return { available, preview };
  };

  const skillsData = assets ? filterAssets(assets.skills, isSkillOwned) : { available: [], preview: [] };
  const itemsData = assets ? filterGeneric(assets.items) : { available: [], preview: [] };
  const buildingsData = assets ? filterGeneric(assets.buildings) : { available: [], preview: [] };

  const skillsToDisplay = [...skillsData.available, ...skillsData.preview];
  const itemsToDisplay = [...itemsData.available, ...itemsData.preview];
  const buildingsToDisplay = [...buildingsData.available, ...buildingsData.preview];

  // Vérification des ressources
  const skillInsufficient = (price: number): boolean => dinosaur.skill_points < price;
  const moneyInsufficient = (price: number): boolean => dinosaur.money < price;

  // Détermine quelles catégories afficher dans le menu
  const availableTabs = {
    skills: skillsToDisplay.length > 0,
    items: itemsToDisplay.length > 0,
    buildings: buildingsToDisplay.length > 0,
  };

  useEffect(() => {
    if (!availableTabs[selectedTab]) {
      const newTab = Object.keys(availableTabs).find(tab => availableTabs[tab as keyof typeof availableTabs]);
      if (newTab) setSelectedTab(newTab as 'skills' | 'items' | 'buildings');
    }
  }, [availableTabs, selectedTab]);

  const handlePurchaseSkill = async (skillId: number) => {
    try {
      const result = await purchaseSkill(skillId);
      setActionMessage(result.message);
      if (onDinosaurUpdate) onDinosaurUpdate(result.dinosaur);
    } catch (error: any) {
      console.error('Erreur achat compétence:', error);
      setErrorMessage(error.message || 'Erreur lors de l’achat de la compétence.');
    }
  };

  const handlePurchaseItem = async (itemId: number) => {
    try {
      const result = await purchaseItem(itemId);
      setActionMessage(result.message);
      if (onDinosaurUpdate) onDinosaurUpdate(result.dinosaur);
    } catch (error: any) {
      console.error('Erreur achat item:', error);
      setErrorMessage(error.message || "Erreur lors de l’achat de l’item.");
    }
  };

  const handleUpgradeItem = async (itemId: number) => {
    try {
      const result = await upgradeItem(itemId);
      setActionMessage(result.message);
      if (onDinosaurUpdate) onDinosaurUpdate(result.dinosaur);
    } catch (error: any) {
      console.error('Erreur upgrade item:', error);
      setErrorMessage(error.message || "Erreur lors de l’upgrade de l’item.");
    }
  };

  const handlePurchaseBuilding = async (buildingId: number) => {
    try {
      const result = await purchaseBuilding(buildingId);
      setActionMessage(result.message);
      if (onDinosaurUpdate) onDinosaurUpdate(result.dinosaur);
    } catch (error: any) {
      console.error('Erreur achat bâtiment:', error);
      setErrorMessage(error.message || "Erreur lors de l’achat du bâtiment.");
    }
  };

  const handleUpgradeBuilding = async (buildingId: number, upgradeId: number) => {
    try {
      const result = await upgradeBuilding(buildingId, upgradeId);
      setActionMessage(result.message);
      if (onDinosaurUpdate) onDinosaurUpdate(result.dinosaur);
    } catch (error: any) {
      console.error('Erreur upgrade bâtiment:', error);
      setErrorMessage(error.message || "Erreur lors de l’upgrade du bâtiment.");
    }
  };

  if (!active) return null;
  if (loading) {
    return (
      <div className="shop-overlay active">
        <div className="shop-overlay-content">
          <p>Chargement du shop…</p>
          <button onClick={closeOverlay}>Fermer</button>
        </div>
      </div>
    );
  }

  return (
    <div className="shop-overlay active">
      <div className="shop-overlay-content">
        <header>
          <h2>Shop</h2>
          <button className="close-button" onClick={closeOverlay}>×</button>
        </header>

        {errorMessage && <p className="error-message">{errorMessage}</p>}
        {actionMessage && <p className="success-message">{actionMessage}</p>}

        <nav className="shop-tabs">
          {availableTabs.skills && (
            <button 
              className={selectedTab === 'skills' ? 'active' : ''} 
              onClick={() => setSelectedTab('skills')}
            >
              Compétences
            </button>
          )}
          {availableTabs.items && (
            <button 
              className={selectedTab === 'items' ? 'active' : ''} 
              onClick={() => setSelectedTab('items')}
            >
              Items
            </button>
          )}
          {availableTabs.buildings && (
            <button 
              className={selectedTab === 'buildings' ? 'active' : ''} 
              onClick={() => setSelectedTab('buildings')}
            >
              Bâtiments
            </button>
          )}
        </nav>

        <div className="shop-items">
          {selectedTab === 'skills' &&
            skillsToDisplay.map((skill) => {
              const preview = skill.minLevelToBuy === dinosaur.level + 1;
              // Affiche en mode actif si dino.level >= skill.minLevelToBuy et non preview
              const insufficient = !preview && skillInsufficient(skill.price);
              return (
                <ShopSkillCard 
                  key={skill.id} 
                  skill={skill} 
                  onPurchase={handlePurchaseSkill} 
                  preview={preview}
                  insufficientResources={insufficient}
                />
              );
            })
          }
          {selectedTab === 'items' &&
            itemsToDisplay.map((item) => {
              const preview = item.minLevelToBuy === dinosaur.level + 1;
              const insufficient = !preview && moneyInsufficient(item.price);
              return (
                <ShopItemCard 
                  key={item.id} 
                  item={item} 
                  onPurchase={handlePurchaseItem} 
                  onUpgrade={handleUpgradeItem}
                  preview={preview}
                  insufficientResources={insufficient}
                />
              );
            })
          }
          {selectedTab === 'buildings' &&
            buildingsToDisplay.map((building) => {
              const preview = building.minLevelToBuy === dinosaur.level + 1;
              const insufficient = !preview && moneyInsufficient(building.price);
              return (
                <ShopBuildingCard 
                  key={building.id} 
                  building={building} 
                  onPurchase={handlePurchaseBuilding} 
                  onUpgrade={handleUpgradeBuilding}
                  preview={preview}
                  insufficientResources={insufficient}
                />
              );
            })
          }
        </div>
      </div>
    </div>
  );
};

export default ShopOverlay;
