import React, { useEffect, useState } from 'react';
import { Dinosaur } from '../../types/Dinosaur';
import { Epoch } from '../../types/Epoch';
import { DinosaurEvent } from '../../types/DinosaurEvent';
import { ActionDetail } from './Actions';
import './BackgroundOverlay.css';

interface BackgroundOverlayProps {
  dinosaur: Dinosaur;
  lastEvent: DinosaurEvent | null;
  action: ActionDetail | null;
}

const EPOCH_BACKGROUND_IMAGES: Record<Epoch, string> = Object.values(Epoch).reduce((acc, epoch) => {
  acc[epoch as Epoch] = `/assets/img/epochs/${epoch}.webp`;
  return acc;
}, {} as Record<Epoch, string>);

interface Particle {
  id: number;
  style: React.CSSProperties & { [key: string]: string | number };
  type: 'food' | 'experience';
}

const BackgroundOverlay: React.FC<BackgroundOverlayProps> = ({ dinosaur, lastEvent, action }) => {
  const [actionClass, setActionClass] = useState<string>('');
  const [eventClass, setEventClass] = useState<string>('');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [karmaEffectClass, setKarmaEffectClass] = useState<string>('');

  let imageUrl = EPOCH_BACKGROUND_IMAGES[dinosaur.epoch] || EPOCH_BACKGROUND_IMAGES[Epoch.Ancient_Epoch1];

  if (dinosaur.isDead) {
    imageUrl = `/assets/img/epochs/graveyard.webp`;
  }

  // Gestion de l'effet de sommeil
  const sleepingClass = dinosaur.isSleeping ? 'sleeping' : '';

  // Gestion des animations d'action
  useEffect(() => {
    if (action) {
      const actionClassName = `action-${action.name.toLowerCase().replace(/\s+/g, '-')}`;
      setActionClass(actionClassName);
    }
  }, [action]);

  // Gestion des animations d'événement
  useEffect(() => {
    if (lastEvent) {
      // Démarre l'animation d'événement
      setEventClass('event-animation');

      // Gérer les particules pour foodChange et experienceChange
      const particlesArray: Particle[] = [];
      let particleId = 0;

      // Générer des particules pour foodChange
      if (lastEvent.foodChange) {
        const numParticles = Math.min(50, Math.ceil(Math.abs(lastEvent.foodChange) / 2));
        for (let i = 0; i < numParticles; i++) {
          const translateX = (Math.random() - 0.5) * 100; // Mouvement horizontal aléatoire
          const translateY = -100 - Math.random() * 300; // Mouvement vers le haut
          const animationDuration = 2 + Math.random(); // Durée plus longue
          const particle: Particle = {
            id: particleId++,
            type: 'food',
            style: {
              left: `${Math.random() * 100}%`, // Position horizontale aléatoire en bas
              bottom: '0%',
              '--translateX': `${translateX}px`,
              '--translateY': `${translateY}px`,
              '--animationDuration': `${animationDuration}s`,
            },
          };
          particlesArray.push(particle);
        }
      }

      // Générer des particules pour experienceChange
      if (lastEvent.experienceChange) {
        const numParticles = Math.min(50, Math.ceil(Math.abs(lastEvent.experienceChange) / 2));
        for (let i = 0; i < numParticles; i++) {
          const translateX = (Math.random() - 0.5) * 100; // Mouvement horizontal aléatoire
          const translateY = -100 - Math.random() * 300; // Mouvement vers le haut
          const animationDuration = 2 + Math.random(); // Durée plus longue
          const particle: Particle = {
            id: particleId++,
            type: 'experience',
            style: {
              left: `${Math.random() * 100}%`, // Position horizontale aléatoire en bas
              bottom: '0%',
              '--translateX': `${translateX}px`,
              '--translateY': `${translateY}px`,
              '--animationDuration': `${animationDuration}s`,
            },
          };
          particlesArray.push(particle);
        }
      }

      setParticles(particlesArray);

      // Gérer l'effet de karma
      if (lastEvent.karmaChange) {
        if (lastEvent.karmaChange > 0) {
          setKarmaEffectClass('karma-brighten');
        } else if (lastEvent.karmaChange < 0) {
          setKarmaEffectClass('karma-darken');
        }
      }

      // Supprimer les animations après une courte durée
      const timer = setTimeout(() => {
        setEventClass('');
        setActionClass('');
        setParticles([]);
        setKarmaEffectClass('');
      }, 4000); // Durée étendue

      return () => clearTimeout(timer);
    }
  }, [lastEvent]);

  // Combiner les classes CSS
  const classes = ['background-overlay', sleepingClass, actionClass, eventClass, karmaEffectClass].filter(Boolean).join(' ');

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1,
  };

  const imgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  return (
    <div className={classes} style={overlayStyle}>
      <img src={imageUrl} alt="Background" style={imgStyle} />
      {/* Afficher les particules */}
      <div className="particles-container">
        {particles.map(particle => (
          <div
            key={particle.id}
            className={`particle particle-${particle.type}`}
            style={particle.style}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default BackgroundOverlay;
