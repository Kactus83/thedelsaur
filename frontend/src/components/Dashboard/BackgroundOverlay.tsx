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
  levelUp: boolean;
}

const EPOCH_BACKGROUND_IMAGES: Record<Epoch, string> = Object.values(Epoch).reduce((acc, epoch) => {
  acc[epoch as Epoch] = `/assets/img/epochs/${epoch}.webp`;
  return acc;
}, {} as Record<Epoch, string>);

interface Particle {
  id: number;
  style: React.CSSProperties & { [key: string]: string | number };
  type: 'food' | 'experience' | 'levelUp';
}

const BackgroundOverlay: React.FC<BackgroundOverlayProps> = ({ dinosaur, lastEvent, action, levelUp }) => {
  const [actionClass, setActionClass] = useState<string>('');
  const [eventClass, setEventClass] = useState<string>('');
  const [particles, setParticles] = useState<Particle[]>([]);
  const [karmaEffectClass, setKarmaEffectClass] = useState<string>('');
  const [levelUpClass, setLevelUpClass] = useState<string>('');

  let imageUrl = EPOCH_BACKGROUND_IMAGES[dinosaur.epoch] || EPOCH_BACKGROUND_IMAGES[Epoch.Ancient_Epoch1];

  if (dinosaur.isDead) {
    imageUrl = `/assets/img/epochs/graveyard.webp`;
  }

  const sleepingClass = dinosaur.isSleeping ? 'sleeping' : '';

  // Gestion des animations d'action
  useEffect(() => {
    if (action) {
      const actionClassName = `action-${action.name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
      setActionClass(actionClassName);
    }
  }, [action]);

  // Gestion des animations d'événement
  useEffect(() => {
    if (lastEvent) {
      setEventClass(`event-animation-${Date.now()}`);

      const newParticles: Particle[] = [];
      let particleId = Date.now();

      if (lastEvent.foodChange) {
        const numParticles = Math.min(100, Math.ceil(Math.abs(lastEvent.foodChange) / 5));
        for (let i = 0; i < numParticles; i++) {
          const translateX = (Math.random() - 0.5) * 100;
          const translateY = -100 - Math.random() * 300;
          const animationDuration = 2 + Math.random();
          const particle: Particle = {
            id: particleId++,
            type: 'food',
            style: {
              left: `${Math.random() * 100}%`,
              bottom: '0%',
              '--translateX': `${translateX}px`,
              '--translateY': `${translateY}px`,
              '--animationDuration': `${animationDuration}s`,
            },
          };
          newParticles.push(particle);
        }
      }

      if (lastEvent.experienceChange) {
        const numParticles = Math.min(100, Math.ceil(Math.abs(lastEvent.experienceChange) / 5));
        for (let i = 0; i < numParticles; i++) {
          const translateX = (Math.random() - 0.5) * 100;
          const translateY = -100 - Math.random() * 300;
          const animationDuration = 2 + Math.random();
          const particle: Particle = {
            id: particleId++,
            type: 'experience',
            style: {
              left: `${Math.random() * 100}%`,
              bottom: '0%',
              '--translateX': `${translateX}px`,
              '--translateY': `${translateY}px`,
              '--animationDuration': `${animationDuration}s`,
            },
          };
          newParticles.push(particle);
        }
      }

      setParticles(newParticles);

      if (lastEvent.karmaChange) {
        const uniqueClass = lastEvent.karmaChange > 0 ? `karma-brighten-${Date.now()}` : `karma-darken-${Date.now()}`;
        setKarmaEffectClass(uniqueClass);
      }

      const timer = setTimeout(() => {
        setEventClass('');
        setActionClass('');
        setKarmaEffectClass('');
        setParticles([]);
      }, 4000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [lastEvent]);

  // Gestion de l'animation de montée de niveau
  useEffect(() => {
    if (levelUp) {
      const uniqueClass = `level-up-${Date.now()}`;
      setLevelUpClass(uniqueClass);

      // Générer des particules pour la montée de niveau
      const newParticles: Particle[] = [];
      let particleId = Date.now();
      const numParticles = 150; // Nombre de particules pour l'effet de niveau

      for (let i = 0; i < numParticles; i++) {
        const angle = Math.random() * 2 * Math.PI;
        const speed = 100 + Math.random() * 200;
        const translateX = Math.cos(angle) * speed;
        const translateY = Math.sin(angle) * speed;
        const animationDuration = 2 + Math.random() * 2;
        const particle: Particle = {
          id: particleId++,
          type: 'levelUp',
          style: {
            left: '50%',
            top: '50%',
            '--translateX': `${translateX}px`,
            '--translateY': `${translateY}px`,
            '--animationDuration': `${animationDuration}s`,
          },
        };
        newParticles.push(particle);
      }

      setParticles(prevParticles => [...prevParticles, ...newParticles]);

      // Nettoyer après l'animation
      const timer = setTimeout(() => {
        setLevelUpClass('');
        setParticles([]);
      }, 2000);

      return () => {
        clearTimeout(timer);
      };
    }
  }, [levelUp]);

  const classes = ['background-overlay', sleepingClass, actionClass, eventClass, karmaEffectClass, levelUpClass]
    .filter(Boolean)
    .join(' ');

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
