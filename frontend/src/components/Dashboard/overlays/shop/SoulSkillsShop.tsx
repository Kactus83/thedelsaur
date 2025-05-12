import React, { useState } from 'react';
import { DinosaurSoulSkillDTO, SoulType } from '../../../../types/dinosaur-soul-skill.dto';
import { DinosaurSoulSkillInstanceDTO } from '../../../../types/dinosaur-soul-skill-instance.dto';
import { User } from '../../../../types/User';
import ShopSoulSkillCard from './cards/ShopSoulSkillCard';
import './ShopOverlay.css';

interface SoulSkillsShopProps {
  soulSkills: DinosaurSoulSkillDTO[];
  soulInstances: DinosaurSoulSkillInstanceDTO[];
  dinosaurLevel: number;
  user: User;
  onPurchase: (soulSkillId: number) => void;
}

const typeOptions = ['all', SoulType.Neutral, SoulType.Bright, SoulType.Dark] as const;

const SoulSkillsShop: React.FC<SoulSkillsShopProps> = ({
  soulSkills,
  soulInstances,
  dinosaurLevel,
  user,
  onPurchase,
}) => {
  const [typeFilter, setTypeFilter] = useState<typeof typeOptions[number]>('all');

  const ownedIds = soulInstances.filter(s => s.isUnlocked).map(s => s.id);
  const available = soulSkills.filter(
    s => s.tier <= dinosaurLevel && !ownedIds.includes(s.id)
  );
  const preview   = soulSkills.filter(
    s => s.tier === dinosaurLevel + 1
  );

  const order: Record<string, number> = {
    [SoulType.Neutral]: 1,
    [SoulType.Bright]: 2,
    [SoulType.Dark]: 3,
  };
  const filtered = [...available, ...preview]
    .filter(s => typeFilter === 'all' || s.soulType === typeFilter)
    .sort((a, b) =>
      order[a.soulType] - order[b.soulType] || a.tier - b.tier
    );

  const neutralList = filtered.filter(s => s.soulType === SoulType.Neutral);
  const brightList  = filtered.filter(s => s.soulType === SoulType.Bright);
  const darkList    = filtered.filter(s => s.soulType === SoulType.Dark);

  return (
    <>
      <div className="shop-filter">
        <div className="filter-group">
          <label>Type d'âme :</label>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as typeof typeFilter)}
          >
            {typeOptions.map(opt => (
              <option key={opt} value={opt}>
                {opt === 'all'
                  ? 'Tous'
                  : opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {neutralList.length > 0 && (
        <div className="shop-section">
          <div className="shop-section-header">Neutral</div>
          <div className="shop-items">
            {neutralList.map(soul => {
              const isPreview = soul.tier === dinosaurLevel + 1;
              let insufficient = true;
              if (!isPreview) {
                insufficient =
                  user.neutral_soul_points < soul.price;
              }
              return (
                <div key={soul.id} className="shop-card-wrapper">
                  <ShopSoulSkillCard
                    soulSkill={soul}
                    onPurchase={onPurchase}
                    preview={isPreview}
                    disabled={false}
                    insufficientResources={insufficient}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {brightList.length > 0 && (
        <div className="shop-section">
          <div className="shop-section-header">Bright</div>
          <div className="shop-items">
            {brightList.map(soul => {
              const isPreview = soul.tier === dinosaurLevel + 1;
              const insufficient = !isPreview && user.bright_soul_points < soul.price;
              return (
                <div key={soul.id} className="shop-card-wrapper">
                  <ShopSoulSkillCard
                    soulSkill={soul}
                    onPurchase={onPurchase}
                    preview={isPreview}
                    disabled={false}
                    insufficientResources={insufficient}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {darkList.length > 0 && (
        <div className="shop-section">
          <div className="shop-section-header">Dark</div>
          <div className="shop-items">
            {darkList.map(soul => {
              const isPreview = soul.tier === dinosaurLevel + 1;
              const insufficient = !isPreview && user.dark_soul_points < soul.price;
              return (
                <div key={soul.id} className="shop-card-wrapper">
                  <ShopSoulSkillCard
                    soulSkill={soul}
                    onPurchase={onPurchase}
                    preview={isPreview}
                    disabled={false}
                    insufficientResources={insufficient}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default SoulSkillsShop;