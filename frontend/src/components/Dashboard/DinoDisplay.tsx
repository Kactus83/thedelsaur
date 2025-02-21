import React, { useEffect, useState } from 'react';
import { Dinosaur } from '../../types/Dinosaur';
import { DinosaurEvent } from '../../types/DinosaurEvent';
import { ActionDetail } from './Actions';
import './DinoDisplay.css';
import DinoActionWheel from './DinoActionWheel';
import { GameplayService } from '../../services/gameplay.service';

/**
 * Mapping des cibles de modificateur vers leur emoji associé.
 */
const modifierEmojiMapping: Record<string, string> = {
  energy: '⚡',
  food: '🍎',
  hunger: '😰',
  experience: '📚',
  karma: '☯️',
  money: '💰',
  skillPoints: '⭐',
  weapons: '⚔️',
  armors: '🛡️',
  friends: '🤝',
  employees: '👥',
};

/**
 * Liste des cibles pour lesquelles on souhaite afficher une notification emoji
 * (le karma étant géré séparément via une animation sur l'image).
 */
const emojiTargets = ['experience', 'money', 'skillPoints', 'weapons', 'armors', 'friends', 'employees'];

interface EmojiNotification {
  id: number;
  emoji: string;
  left: number; // Position horizontale en pourcentage dans le container
}

interface DinoDisplayProps {
  dinosaur: Dinosaur;
  lastEvent: DinosaurEvent | null;
  action: ActionDetail | null;
  levelUp: boolean;
}

const DinoDisplay: React.FC<DinoDisplayProps> = (props: DinoDisplayProps) => {
  const { dinosaur, lastEvent, action, levelUp } = props;

  // Construit le chemin de l'image en fonction du régime et du type
  const dietName = dinosaur?.diet?.name.toLowerCase();
  const typeName = dinosaur?.type?.name.toLowerCase();
  const dinosaurImagePath = dinosaur ? `/assets/dino/dino_${dietName}_${typeName}.svg` : '';

  // Détermine l'animation d'action en fonction du nom de l'action
  let animation = '';
  switch (action?.name) {
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
    case 'Découvrir':
    case 'Voler':
      animation = 'wonder';
      break;
    default:
      break;
  }
  if (dinosaur.is_sleeping && !dinosaur.is_dead) {
    animation = 'sleep';
  }

  // Animation de montée de niveau (logique existante)
  const [levelUpClass, setLevelUpClass] = useState<string>('');
  useEffect(() => {
    if (levelUp) {
      const uniqueClass = `level-up-${Date.now()}`;
      setLevelUpClass(uniqueClass);
      const timer = setTimeout(() => {
        setLevelUpClass('');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [levelUp]);

  // Gestion de l'animation de Karma : si l'event contient un modificateur de karma,
  // on applique une animation de pulsation sur l'image du dino.
  const [karmaAnimationClass, setKarmaAnimationClass] = useState<string>('');
  useEffect(() => {
    if (lastEvent) {
      const hasKarma = lastEvent.modifiers.some(mod => mod.target === 'karma');
      if (hasKarma) {
        setKarmaAnimationClass('karma-animation');
        const timer = setTimeout(() => {
          setKarmaAnimationClass('');
        }, 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [lastEvent]);

  // Gestion des notifications emoji pour les gains (xp, argent, etc.)
  const [emojiNotifications, setEmojiNotifications] = useState<EmojiNotification[]>([]);
  useEffect(() => {
    if (lastEvent) {
      lastEvent.modifiers.forEach(mod => {
        if (emojiTargets.includes(mod.target)) {
          const emoji = modifierEmojiMapping[mod.target] || '';
          const id = Date.now() + Math.floor(Math.random() * 1000);
          // Position horizontale aléatoire entre 20% et 80%
          const left = Math.floor(Math.random() * 60) + 20;
          const newNotification: EmojiNotification = { id, emoji, left };
          setEmojiNotifications(prev => [...prev, newNotification]);
          // Suppression de la notification après la durée de l'animation (1.5s)
          setTimeout(() => {
            setEmojiNotifications(prev => prev.filter(notif => notif.id !== id));
          }, 1500);
        }
      });
    }
  }, [lastEvent]);

  // Combine les classes CSS pour l'image du dino
  const className = `dino-svg ${dinosaur.is_dead ? 'dino-dead' : 'dino-alive'} ${animation} ${levelUpClass} ${karmaAnimationClass}`;

  // Affichage de la roue d'actions au survol (logique existante)
  const [showActionWheel, setShowActionWheel] = useState<boolean>(false);
  // Simulation d'une injection future de GameplayService
  const gameplayService = new GameplayService();

  return (
    <div 
      className="dino-display-container"
      onMouseEnter={() => setShowActionWheel(true)}
      onMouseLeave={() => setShowActionWheel(false)}
    >
      <img
        src={dinosaurImagePath}
        alt={`Dinosaure ${dinosaur.name}`}
        className={className}
      />
      {/* Notifications emoji animées pour les gains (xp, etc.) */}
      {emojiNotifications.map(notif => (
        <span 
          key={notif.id} 
          className="emoji-notification" 
          style={{ left: `${notif.left}%` }}
        >
          {notif.emoji}
        </span>
      ))}
      {showActionWheel && (
        <DinoActionWheel
          dinosaur={dinosaur}
          gameplayService={gameplayService}
          onClose={() => setShowActionWheel(false)}
        />
      )}
    </div>
  );
};

export default DinoDisplay;
