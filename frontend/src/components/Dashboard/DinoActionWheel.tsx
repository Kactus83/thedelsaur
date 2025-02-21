import React from 'react';
import './DinoActionWheel.css';

export interface Action {
  id: number;
  name: string;
  icon?: string;
  onClick: () => void;
}

interface DinoActionWheelProps {
  actions: Action[];
  onClose: () => void;
}

const DinoActionWheel: React.FC<DinoActionWheelProps> = ({ actions, onClose }) => {
  const radius = 100;
  const angleStep = (2 * Math.PI) / actions.length;

  return (
    <div className="dino-action-wheel-overlay" onClick={onClose}>
      <div className="dino-action-wheel" onClick={(e) => e.stopPropagation()}>
        {actions.map((action, index) => {
          const angle = index * angleStep - Math.PI / 2; // démarrage en haut
          const x = radius * Math.cos(angle);
          const y = radius * Math.sin(angle);
          return (
            <button
              key={action.id}
              className="dino-action-button"
              style={{ transform: `translate(${x}px, ${y}px)` }}
              onClick={() => {
                action.onClick();
                onClose();
              }}
            >
              {action.icon ? <img src={action.icon} alt={action.name} /> : action.name}
            </button>
          );
        })}
        <button className="dino-action-wheel-close" onClick={onClose}>
          &times;
        </button>
      </div>
    </div>
  );
};

export default DinoActionWheel;
