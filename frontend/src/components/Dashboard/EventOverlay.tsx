import React from 'react';
import './EventOverlay.css';

interface EventOverlayProps {
  eventMessage: string;
}

const EventOverlay: React.FC<EventOverlayProps> = ({ eventMessage }) => {
  return (
    <div className="event-overlay">
      <div className="event-message">{eventMessage}</div>
    </div>
  );
};

export default EventOverlay;