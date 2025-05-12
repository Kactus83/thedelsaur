import React, { useState } from 'react';
import { DinosaurSkillDTO } from '../../../../types/dinosaur-skill.dto';
import { DinosaurSkillInstanceDTO } from '../../../../types/dinosaur-skill-instance.dto';
import ShopSkillCard from './cards/ShopSkillCard';
import './ShopOverlay.css';

interface SkillsShopProps {
  skills: DinosaurSkillDTO[];
  skillInstances: DinosaurSkillInstanceDTO[];
  dinosaurLevel: number;
  skillPoints: number;
  onPurchase: (skillId: number) => void;
}

const typeOptions = ['all', 'permanent', 'triggered'] as const;
const categoryOptions = ['all', 'food', 'energy', 'money', 'karma', 'experience'] as const;

const SkillsShop: React.FC<SkillsShopProps> = ({
  skills,
  skillInstances,
  dinosaurLevel,
  skillPoints,
  onPurchase,
}) => {
  const [typeFilter, setTypeFilter] = useState<typeof typeOptions[number]>('all');
  const [categoryFilter, setCategoryFilter] = useState<typeof categoryOptions[number]>('all');

  const ownedIds = skillInstances.filter(s => s.isPurchased).map(s => s.id);

  const available = skills.filter(
    s => s.minLevelToBuy <= dinosaurLevel && !ownedIds.includes(s.id)
  );
  const preview   = skills.filter(
    s => s.minLevelToBuy === dinosaurLevel + 1
  );

  const filtered = [...available, ...preview]
    .filter(s =>
      (typeFilter === 'all' || s.type === typeFilter) &&
      (categoryFilter === 'all' || s.category === categoryFilter)
    )
    .sort((a, b) => {
      if (a.type !== b.type) return a.type.localeCompare(b.type);
      if (a.category !== b.category) return a.category.localeCompare(b.category);
      return a.tier - b.tier;
    });

  const permanentList = filtered.filter(s => s.type === 'permanent');
  const triggeredList = filtered.filter(s => s.type === 'triggered');

  return (
    <>
      <div className="shop-filter">
        <div className="filter-group">
          <label>Type :</label>
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value as typeof typeFilter)}
          >
            {typeOptions.map(opt => (
              <option key={opt} value={opt}>
                {opt === 'all' ? 'Tous' : opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-group">
          <label>Catégorie :</label>
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value as typeof categoryFilter)}
          >
            {categoryOptions.map(opt => (
              <option key={opt} value={opt}>
                {opt === 'all' ? 'Toutes' : opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {permanentList.length > 0 && (
        <div className="shop-section">
          <div className="shop-section-header">Permanentes</div>
          <div className="shop-items">
            {permanentList.map(skill => {
              const isPreview = skill.minLevelToBuy === dinosaurLevel + 1;
              const insufficient = !isPreview && skillPoints < skill.price;
              return (
                <div key={skill.id} className="shop-card-wrapper">
                  <span className={`badge category-${skill.category}`}>{skill.category}</span>
                  <ShopSkillCard
                    skill={skill}
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

      {triggeredList.length > 0 && (
        <div className="shop-section">
          <div className="shop-section-header">Déclenchées</div>
          <div className="shop-items">
            {triggeredList.map(skill => {
              const isPreview = skill.minLevelToBuy === dinosaurLevel + 1;
              const insufficient = !isPreview && skillPoints < skill.price;
              return (
                <div key={skill.id} className="shop-card-wrapper">
                  <span className={`badge category-${skill.category}`}>{skill.category}</span>
                  <ShopSkillCard
                    skill={skill}
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

export default SkillsShop;