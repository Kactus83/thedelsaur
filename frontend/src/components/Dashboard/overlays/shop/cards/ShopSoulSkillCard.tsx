import React from 'react';
import { DinosaurSoulSkillDTO } from '../../../../../types/dinosaur-soul-skill.dto';
import './ShopCard.css';

interface ShopSoulSkillCardProps {
  soulSkill: DinosaurSoulSkillDTO;
  onPurchase: (soulSkillId: number) => void;
  preview?: boolean;
  disabled?: boolean;
  insufficientResources?: boolean;
}

const getEmojiForSoulType = (type: string): string => {
  if (type === 'neutral') return '⚖️';
  if (type === 'bright') return '🌟';
  if (type === 'dark') return '🌑';
  return '❓';
};

const ShopSoulSkillCard: React.FC<ShopSoulSkillCardProps> = ({
  soulSkill,
  onPurchase,
  preview = false,
  disabled = false,
  insufficientResources = false,
}) => {
  const icon = getEmojiForSoulType(soulSkill.soulType);

  return (
    <div className="shop-card">
      <div className="shop-card-image" style={{ fontSize: '3rem' }}>
        {icon}
      </div>
      <div className="shop-card-content">
        <div>
          <h3>{soulSkill.name}</h3>
          <p>{soulSkill.description}</p>
        </div>
        <div>
          <p className="shop-card-price">
            <span className="price-icon">{icon}</span>
            Prix : {soulSkill.price} pts
          </p>
          <p className="shop-card-minlevel">
            Niveau min : {soulSkill.tier}
          </p>
        </div>
        <div className="shop-card-actions">
          {preview ? (
            <button className="shop-card-btn" disabled>
              Prochain niveau
            </button>
          ) : (
            <button
              className="shop-card-btn"
              disabled={disabled || insufficientResources}
              onClick={() => onPurchase(soulSkill.id)}
            >
              {insufficientResources ? "Pas assez de pts" : "Acheter"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopSoulSkillCard;