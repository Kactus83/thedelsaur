import React, { useEffect, useState } from 'react';
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

import SkillsShop from './shop/SkillsShop';
import SoulSkillsShop from './shop/SoulSkillsShop';
import ItemsShop from './shop/ItemsShop';
import BuildingsShop from './shop/BuildingsShop';
import './shop/ShopOverlay.css';

interface ShopOverlayProps {
  onDinosaurUpdate?: (dino: Dinosaur) => void;
  active?: boolean;
  dinosaur: Dinosaur;
  user: User;
}

const ShopOverlay: React.FC<ShopOverlayProps> = ({
  onDinosaurUpdate,
  active = false,
  dinosaur,
  user
}) => {
  const [assets, setAssets] = useState<ShopAssetsDTO | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [actionMessage, setActionMessage] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const { closeOverlay } = useOverlay();

  const [selectedTab, setSelectedTab] = useState<
    'skills' | 'soulSkills' | 'items' | 'buildings'
  >('skills');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchShopAssets();
        setAssets(data);
      } catch (err) {
        console.error('Erreur chargement shop:', err);
        setErrorMessage('Erreur lors du chargement des assets.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handlePurchaseSkill = async (id: number) => {
    try {
      const res = await purchaseSkill(id);
      setActionMessage(res.message);
      onDinosaurUpdate?.(res.dinosaur);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erreur achat compétence.');
    }
  };
  const handlePurchaseSoul = async (id: number) => {
    try {
      const res = await purchaseSoulSkill(id);
      setActionMessage(res.message);
      onDinosaurUpdate?.(res.dinosaur);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erreur achat soul skill.');
    }
  };
  const handlePurchaseItem = async (id: number) => {
    try {
      const res = await purchaseItem(id);
      setActionMessage(res.message);
      onDinosaurUpdate?.(res.dinosaur);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erreur achat item.');
    }
  };
  const handlePurchaseBuilding = async (id: number) => {
    try {
      const res = await purchaseBuilding(id);
      setActionMessage(res.message);
      onDinosaurUpdate?.(res.dinosaur);
    } catch (err: any) {
      setErrorMessage(err.message || 'Erreur achat bâtiment.');
    }
  };

  if (!active) return null;
  if (loading || !assets) {
    return (
      <div className="shop-overlay active">
        <div className="shop-overlay-content">
          <p>Chargement du shop…</p>
          <button onClick={closeOverlay}>Fermer</button>
        </div>
      </div>
    );
  }

  const tabs = [
    { key: 'skills',     label: 'Compétences',   available: assets.skills.length > 0 },
    { key: 'soulSkills', label: 'Soul Skills',   available: assets.soulSkills.length > 0 },
    { key: 'items',      label: 'Items',         available: assets.items.length > 0 },
    { key: 'buildings',  label: 'Bâtiments',     available: assets.buildings.length > 0 },
  ] as const;

  return (
    <div className="shop-overlay active">
      <div className="shop-overlay-content">
        <header>
          <h2>Shop</h2>
          <button className="close-button" onClick={closeOverlay}>×</button>
        </header>

        {/* Resource indicators */}
        <div className="shop-resources">
          <div className="shop-resource">
            <span className="icon">💰</span>
            <span className="label">Argent</span>
            <span className="value">{dinosaur.money}</span>
          </div>
          <div className="shop-resource">
            <span className="icon">⭐</span>
            <span className="label">Skill</span>
            <span className="value">{dinosaur.skill_points}</span>
          </div>
          <div className="shop-resource">
            <span className="icon">⚖️</span>
            <span className="label">Neutral SP</span>
            <span className="value">{user.neutral_soul_points}</span>
          </div>
          <div className="shop-resource">
            <span className="icon">🌟</span>
            <span className="label">Bright SP</span>
            <span className="value">{user.bright_soul_points}</span>
          </div>
          <div className="shop-resource">
            <span className="icon">🌑</span>
            <span className="label">Dark SP</span>
            <span className="value">{user.dark_soul_points}</span>
          </div>
        </div>

        {errorMessage  && <p className="error-message">{errorMessage}</p>}
        {actionMessage && <p className="success-message">{actionMessage}</p>}

        <div className="shop-submenu">
          <nav className="shop-tabs">
            {tabs.filter(t => t.available).map(t => (
              <button
                key={t.key}
                className={selectedTab === t.key ? 'active' : ''}
                onClick={() => setSelectedTab(t.key)}
              >
                {t.label}
              </button>
            ))}
          </nav>
        </div>

        {selectedTab === 'skills' && (
          <SkillsShop
            skills={assets.skills}
            skillInstances={dinosaur.skills}
            dinosaurLevel={dinosaur.level}
            skillPoints={dinosaur.skill_points}
            onPurchase={handlePurchaseSkill}
          />
        )}
        {selectedTab === 'soulSkills' && (
          <SoulSkillsShop
            soulSkills={assets.soulSkills}
            soulInstances={dinosaur.soulSkills}
            dinosaurLevel={dinosaur.level}
            user={user}
            onPurchase={handlePurchaseSoul}
          />
        )}
        {selectedTab === 'items' && (
          <ItemsShop
            items={assets.items}
            itemInstances={dinosaur.items}
            dinosaurLevel={dinosaur.level}
            money={dinosaur.money}
            onPurchase={handlePurchaseItem}
          />
        )}
        {selectedTab === 'buildings' && (
          <BuildingsShop
            buildings={assets.buildings}
            buildingInstances={dinosaur.buildings}
            dinosaurLevel={dinosaur.level}
            money={dinosaur.money}
            onPurchase={handlePurchaseBuilding}
          />
        )}
      </div>
    </div>
  );
};

export default ShopOverlay;