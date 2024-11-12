import React from 'react';
import './EventOverlay.css';
import { DinosaurEvent } from '../../types/DinosaurEvent';

interface EventOverlayProps {
  event: DinosaurEvent;
}

const EventOverlay: React.FC<EventOverlayProps> = ({ event }) => {
  return (
    <div className="event-overlay">
      <h3>{event.name}</h3>
      <p>{event.description}</p>
      <div className="event-stats">
        {event.experienceChange !== 0 && (
          <div className="stat-change">
            <span>Expérience :</span>
            <span>{event.experienceChange > 0 ? `+${event.experienceChange}` : event.experienceChange}</span>
          </div>
        )}
        {event.energyChange !== 0 && (
          <div className="stat-change">
            <span>Énergie :</span>
            <span>{event.energyChange > 0 ? `+${event.energyChange}` : event.energyChange}</span>
          </div>
        )}
        {event.foodChange !== 0 && (
          <div className="stat-change">
            <span>Nourriture :</span>
            <span>{event.foodChange > 0 ? `+${event.foodChange}` : event.foodChange}</span>
          </div>
        )}
        {event.hungerChange !== 0 && (
          <div className="stat-change">
            <span>Faim :</span>
            <span>{event.hungerChange > 0 ? `+${event.hungerChange}` : event.hungerChange}</span>
          </div>
        )}
        {event.karmaChange !== 0 && (
          <div className="stat-change">
            <span>Karma :</span>
            <span>{event.karmaChange > 0 ? `+${event.karmaChange}` : event.karmaChange}</span>
          </div>
        )}
        {event.typeChange && (
          <div className="stat-change">
            <span>Type changé en :</span>
            <span>{event.typeChange}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventOverlay;