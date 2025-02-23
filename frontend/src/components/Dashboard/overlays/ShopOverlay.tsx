import React, { useEffect, useState, useMemo } from 'react';
import { 
  fetchShopAssets, 
  purchaseSkill, 
  purchaseSoulSkill, 
  purchaseItem, 
  purchaseBuilding 
} from '../../../services/shopService';
import { ShopAssetsDTO } from '../../../types/shop-assets.dto';
import { Dinosaur } from '../../../types/Dinosaur';
import { User } from '../../../types/User';
import { useOverlay } from '../../../contexts/OverlayContext';
import ShopSkillCard from '../../Dashboard/utils/ShopSkillCard';
import ShopItemCard from '../../Dashboard/utils/ShopItemCard';
import ShopBuildingCard from '../../Dashboard/utils/ShopBuildingCard';
import './ShopOverlay.css';
import ShopSoulSkillCard from '../utils/ShopSoulSkillCard';

interface ShopOverlayProps {
  onDinosaurUpdate?: (dino: Dinosaur) => void;
  active?: boolean;
  dinosaur: Dinosaur;
  user: User;
}

const ShopOverlay: React.FC<ShopOverlayProps> = ({ onDinosaurUpdate, active = false, dinosaur, user }) => {
  const [assets, setAssets] = useState<ShopAssetsDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionMessage, setActionMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { closeOverlay } = useOverlay();
  // Onglets: skills, soulSkills, items, buildings
  const [selectedTab, setSelectedTab] = useState<'skills' | 'items' | 'soulSkills' | 'buildings'>('skills');

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

  // Filtrage générique pour assets possédant la propriété minLevelToBuy
  const filterAssets = <T extends { minLevelToBuy: number }>(list: T[], alreadyOwned: (id: number) => boolean) => {
    const available = list.filter(asset => asset.minLevelToBuy <= dinosaur.level && !alreadyOwned((asset as any).id));
    const preview = list.filter(asset => asset.minLevelToBuy === dinosaur.level + 1);
    return { available, preview };
  };

  // Filtrage spécifique pour soul skills en utilisant 'tier' comme niveau minimal
  const filterSoulSkills = <T extends { tier: number }>(list: T[], alreadyOwned: (id: number) => boolean) => {
    const available = list.filter(asset => asset.tier <= dinosaur.level && !alreadyOwned((asset as any).id));
    const preview = list.filter(asset => asset.tier === dinosaur.level + 1);
    return { available, preview };
  };

  // Pour skills
  const isSkillOwned = (skillId: number): boolean => {
    return dinosaur.skills.some(s => s.id === skillId && s.isPurchased);
  };

  // Pour soul skills
  const isSoulSkillOwned = (soulSkillId: number): boolean => {
    return dinosaur.soulSkills.some(s => s.id === soulSkillId && s.isUnlocked);
  };

  // Pour items et buildings, on laisse afficher même si déjà possédé pour upgrade (mais pour buildings, on veut les masquer une fois achetés)
  const filterGeneric = <T extends { minLevelToBuy: number }>(list: T[]) => {
    const available = list.filter(asset => asset.minLevelToBuy <= dinosaur.level);
    const preview = list.filter(asset => asset.minLevelToBuy === dinosaur.level + 1);
    return { available, preview };
  };

  const skillsData = assets ? filterAssets(assets.skills, isSkillOwned) : { available: [], preview: [] };
  const itemsData = assets ? filterGeneric(assets.items) : { available: [], preview: [] };
  const soulSkillsData = assets ? filterSoulSkills(assets.soulSkills, isSoulSkillOwned) : { available: [], preview: [] };
  const buildingsData = assets ? filterGeneric(assets.buildings) : { available: [], preview: [] };

  const skillsToDisplay = [...skillsData.available, ...skillsData.preview];
  const itemsToDisplay = [...itemsData.available, ...itemsData.preview];
  const soulSkillsToDisplay = [...soulSkillsData.available, ...soulSkillsData.preview];
  const buildingsToDisplay = [...buildingsData.available, ...buildingsData.preview];

  // Vérification des ressources
  const skillInsufficient = (price: number): boolean => dinosaur.skill_points < price;
  const moneyInsufficient = (price: number): boolean => dinosaur.money < price;
  // Pour les soul skills, le paiement se fait via l'objet User
  const soulInsufficient = (price: number, type: string): boolean => {
    if (type === 'neutral') return user.neutral_soul_points < price;
    if (type === 'bright') return user.bright_soul_points < price;
    if (type === 'dark') return user.dark_soul_points < price;
    return true;
  };

  // Détermine quelles catégories afficher dans le menu
  const availableTabs = useMemo(() => ({
    skills: skillsToDisplay.length > 0,
    soulSkills: assets ? assets.soulSkills.length > 0 : false,
    items: itemsToDisplay.length > 0,
    buildings: buildingsToDisplay.filter(b => !dinosaur.buildings.some(bb => bb.id === b.id)).length > 0,
  }), [assets, skillsToDisplay.length, itemsToDisplay.length, buildingsToDisplay, dinosaur.buildings]);

  useEffect(() => {
    if (!availableTabs[selectedTab]) {
      const newTab = Object.keys(availableTabs).find(tab => availableTabs[tab as keyof typeof availableTabs]);
      if (newTab) setSelectedTab(newTab as 'skills' | 'items' | 'soulSkills' | 'buildings');
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

  const handlePurchaseSoulSkill = async (soulSkillId: number) => {
    try {
      const result = await purchaseSoulSkill(soulSkillId);
      setActionMessage(result.message);
      if (onDinosaurUpdate) onDinosaurUpdate(result.dinosaur);
    } catch (error: any) {
      console.error('Erreur achat soul skill:', error);
      setErrorMessage(error.message || 'Erreur lors de l’achat de la soul skill.');
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
          {availableTabs.soulSkills && (
            <button 
              className={selectedTab === 'soulSkills' ? 'active' : ''} 
              onClick={() => setSelectedTab('soulSkills')}
            >
              Soul Skills
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
          {selectedTab === 'soulSkills' &&
            soulSkillsToDisplay.map((soulSkill) => {
              const preview = soulSkill.tier === dinosaur.level + 1;
              const insufficient = !preview && soulInsufficient(soulSkill.price, soulSkill.soulType);
              return (
                <ShopSoulSkillCard 
                  key={soulSkill.id} 
                  soulSkill={soulSkill} 
                  onPurchase={handlePurchaseSoulSkill} 
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
              // Calcul de la quantité possédée pour cet item
              const ownedQuantity = dinosaur.items.filter(i => i.id === item.id).length;
              return (
                <ShopItemCard 
                  key={item.id} 
                  item={item} 
                  onPurchase={handlePurchaseItem} 
                  onUpgrade={item.itemType === 'persistent' ? undefined : undefined} 
                  preview={preview}
                  insufficientResources={insufficient}
                  ownedQuantity={ownedQuantity}
                />
              );
            })
          }
          {selectedTab === 'buildings' &&
            buildingsToDisplay.map((building) => {
              const preview = building.minLevelToBuy === dinosaur.level + 1;
              const insufficient = !preview && moneyInsufficient(building.price);
              // Masquer le bâtiment s'il est déjà possédé
              if (dinosaur.buildings.some(b => b.id === building.id)) return null;
              return (
                <ShopBuildingCard 
                  key={building.id} 
                  building={building} 
                  onPurchase={handlePurchaseBuilding} 
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
