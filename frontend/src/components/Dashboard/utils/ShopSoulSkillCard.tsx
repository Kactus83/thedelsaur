import React from 'react';
import { DinosaurSoulSkillDTO } from '../../../types/dinosaur-soul-skill.dto';
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
  return (
    <div className="shop-card">
      <div className="shop-card-image" style={{ fontSize: '3rem' }}>
        {getEmojiForSoulType(soulSkill.soulType)}
      </div>
      <div className="shop-card-content">
        <h3>{soulSkill.name}</h3>
        <p>{soulSkill.description}</p>
        <p className="shop-card-price">Prix : {soulSkill.price} pts</p>
        <p className="shop-card-minlevel">Niveau min : {soulSkill.tier}</p>
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
  );
};

export default ShopSoulSkillCard;
