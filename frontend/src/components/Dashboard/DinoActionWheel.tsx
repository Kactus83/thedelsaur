import React, { useState } from 'react';
import './DinoActionWheel.css';
import { Dinosaur } from '../../types/Dinosaur';
import { GameplayService } from '../../services/gameplay.service';

export interface Action {
  id: number;
  name: string;
  icon?: string;
  onClick: () => void;
}

interface DinoActionWheelProps {
  dinosaur: Dinosaur;
  gameplayService: GameplayService;
  onClose: () => void;
}

const DinoActionWheel: React.FC<DinoActionWheelProps> = ({ dinosaur, gameplayService, onClose }) => {

  // Filtrer les skills (uniquement ceux de type Triggered)
  const triggeredSkills = dinosaur.skills.filter(skill => skill.type === 'triggered');
  // Filtrer les items (uniquement consommables)
  const consumableItems = dinosaur.items.filter(item => item.itemType === 'consumable');


  // Toggle entre les deux vues : 'skills' ou 'items'
  const [viewMode, setViewMode] = useState<'skills' | 'items'>('skills');

  // Préparer la liste d'actions selon le mode
  const actions: Action[] = viewMode === 'skills'
    ? triggeredSkills.map(skill => ({
        id: skill.id,
        name: skill.name,
        icon: '⚡', // TODO: mettre en palce un lib plus gtard 
        onClick: async () => {
          // Appeler le service pour activer le skill
          await gameplayService.activateSkill(dinosaur.id, skill.id);
        }
      }))
    : consumableItems.map(item => ({
        id: item.id,
        name: item.name,
        icon: '🍎', // TODO: mettre en palce un lib plus gtard 
        onClick: async () => {
          // Appeler le service pour consommer l'item
          await gameplayService.consumeItem(dinosaur.id, item.id);
        }
      }));

  const radius = 120;
  const angleStep = actions.length > 0 ? (2 * Math.PI) / actions.length : 0;

  return (
    <div className="dino-action-wheel-overlay" onClick={onClose}>
      <div className="dino-action-wheel" onClick={(e) => e.stopPropagation()}>
        {actions.map((action, index) => {
          const angle = index * angleStep - Math.PI / 2; // démarre en haut
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          return (
            <button
              key={action.id}
              className="dino-action-button"
              style={{ transform: `translate(${x}px, ${y}px)` }}
              onClick={async () => {
                await action.onClick();
                onClose();
              }}
            >
              {action.icon ? <img src={action.icon} alt={action.name} /> : action.name}
            </button>
          );
        })}
        {/* Bouton toggle central pour basculer entre skills et items */}
        <button
          className="dino-action-wheel-toggle"
          onClick={(e) => {
            e.stopPropagation();
            setViewMode(viewMode === 'skills' ? 'items' : 'skills');
          }}
        >
          {viewMode === 'skills' ? '⚡' : '🍎'}
        </button>
      </div>
    </div>
  );
};

export default DinoActionWheel;
