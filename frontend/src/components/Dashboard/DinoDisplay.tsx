import React, { useEffect, useState } from 'react';
import { Dinosaur } from '../../types/Dinosaur';
import { DinosaurEvent } from '../../types/DinosaurEvent';
import { ActionDetail } from './Actions';
import './DinoDisplay.css';

interface DinoDisplayProps {
  dinosaur: Dinosaur;
  lastEvent: DinosaurEvent | null;
  action: ActionDetail | null;
  levelUp: boolean;
}

const DinoDisplay: React.FC<DinoDisplayProps> = (props: DinoDisplayProps) => {
  const dinosaurImagePath = props.dinosaur
    ? `/assets/dino/dino_${props.dinosaur.diet}_${props.dinosaur.type}.svg`
    : '';

  let animation = '';

  switch (props.action?.name) {
    case null:
      break;
    case 'Se Réveiller':
      animation = '';
      break;
    case 'Manger':
      animation = 'baisser';
      break;
    case 'Dormir':
      animation = 'sleep';
      break;
    case 'Cueillir':
      animation = 'baisser';
      break;
    case 'Chasser':
      animation = 'wonder';
      break;
    case 'Découvrir':
      animation = 'wonder';
      break;
    case 'Voler':
      animation = 'wonder';
      break;
    default:
      break;
  }

  if (props.dinosaur.isSleeping && !props.dinosaur.isDead) {
    animation = 'sleep';
  }

  // Gestion de l'animation de montée de niveau
  const [levelUpClass, setLevelUpClass] = useState<string>('');
useEffect(() => {
    if (props.levelUp) {
        const uniqueClass = `level-up-${Date.now()}`;
        setLevelUpClass(uniqueClass);

        const timer = setTimeout(() => {
            setLevelUpClass('');
        }, 1000);

        return () => clearTimeout(timer);
    }
}, [props.levelUp]);

  const className = `dino-svg ${props.dinosaur.isDead ? 'dino-dead' : 'dino-alive'} ${animation} ${levelUpClass}`;

  return (
    <img
      src={dinosaurImagePath}
      alt={`Dinosaure ${props.dinosaur.name}`}
      className={className}
    />
  );
};

export default DinoDisplay;
