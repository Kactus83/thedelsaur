import React from 'react';
import { DinosaurSkillDTO } from '../../../types/dinosaur-skill.dto';
import './ShopCard.css';

interface ShopSkillCardProps {
  skill: DinosaurSkillDTO;
  onPurchase: (skillId: number) => void;
  preview?: boolean;
  disabled?: boolean;
  insufficientResources?: boolean;
}

const ShopSkillCard: React.FC<ShopSkillCardProps> = ({
  skill,
  onPurchase,
  preview = false,
  disabled = false,
  insufficientResources = false,
}) => {
  return (
    <div className="shop-card">
      <div className="shop-card-image" style={{ fontSize: '3rem' }}>
        {/* Placeholder emoji pour les compétences */}
        ⚔️
      </div>
      <div className="shop-card-content">
        <h3>{skill.name}</h3>
        <p>{skill.description}</p>
        <p className="shop-card-price">Prix : {skill.price} pts</p>
        <p className="shop-card-minlevel">Niveau min : {skill.minLevelToBuy}</p>
        {preview ? (
          <button className="shop-card-btn" disabled>
            Prochain niveau
          </button>
        ) : (
          <button
            className="shop-card-btn"
            disabled={disabled || insufficientResources}
            onClick={() => onPurchase(skill.id)}
          >
            {insufficientResources ? "Pas assez de points" : "Acheter"}
          </button>
        )}
      </div>
    </div>
  );
};

export default ShopSkillCard;
