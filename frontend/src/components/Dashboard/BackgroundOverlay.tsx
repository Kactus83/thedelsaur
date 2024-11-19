import React, { useEffect, useState } from 'react';
import { Dinosaur } from '../../types/Dinosaur';
import { Epoch } from '../../types/Epoch';
import { DinosaurEvent } from '../../types/DinosaurEvent';
import { ActionDetail } from './Actions';
import './BackgroundOverlay.css'; // Import the CSS file

// Interface for the component's props
interface BackgroundOverlayProps {
  dinosaur: Dinosaur;
  lastEvent: DinosaurEvent | null;
  action: ActionDetail | null;
}

const EPOCH_BACKGROUND_IMAGES: Record<Epoch, string> = Object.values(Epoch).reduce((acc, epoch) => {
  acc[epoch as Epoch] = `/assets/img/epochs/${epoch}.webp`;
  return acc;
}, {} as Record<Epoch, string>);

const BackgroundOverlay: React.FC<BackgroundOverlayProps> = ({ dinosaur, lastEvent, action }) => {
  const [actionClass, setActionClass] = useState<string>('');
  const [eventClass, setEventClass] = useState<string>('');

  let imageUrl = EPOCH_BACKGROUND_IMAGES[dinosaur.epoch] || EPOCH_BACKGROUND_IMAGES[Epoch.Ancient_Epoch1];

  if (dinosaur.isDead) {
    imageUrl = `/assets/img/epochs/graveyard.webp`;
  }

  // Handle sleeping effect
  const sleepingClass = dinosaur.isSleeping ? 'sleeping' : '';

  // Handle action animations
  useEffect(() => {
    if (action) {
      // Start action animation
      const actionClassName = `action-${action.name.toLowerCase().replace(/\s+/g, '-')}`;
      setActionClass(actionClassName);
    }
  }, [action]);

  // Handle event animations
  useEffect(() => {
    if (lastEvent) {
      // Start event animation
      setEventClass('event-animation');

      // Remove event and action animations after a short duration
      const timer = setTimeout(() => {
        setEventClass('');
        setActionClass('');
      }, 500); // Adjust the duration as needed

      return () => clearTimeout(timer);
    }
  }, [lastEvent]);

  // Combine classes
  const classes = ['background-overlay', sleepingClass, actionClass, eventClass].filter(Boolean).join(' ');

  const overlayStyle: React.CSSProperties = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: -1, // Ensures the overlay is behind all other content
  };

  const imgStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    objectFit: 'cover', // Ensures the image covers all the space
  };

  return (
    <div className={classes} style={overlayStyle}>
      <img src={imageUrl} alt="Background" style={imgStyle} />
    </div>
  );
};

export default BackgroundOverlay;
