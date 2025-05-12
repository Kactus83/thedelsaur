import React, { useState } from 'react';
import './ExportControls.css';

interface ExportControlsProps {
  onExport: (weeks: number) => void;
}

const ExportControls: React.FC<ExportControlsProps> = ({ onExport }) => {
  const [duration, setDuration] = useState<number>(2);
  const [unit, setUnit] = useState<'weeks' | 'months' | 'years'>('weeks');

  const convertToWeeks = (d: number, u: string) => {
    switch (u) {
      case 'months': return d * 4;
      case 'years': return d * 52;
      default: return d;
    }
  };

  const handleClick = () => {
    const weeks = convertToWeeks(duration, unit);
    onExport(weeks);
  };

  return (
    <div className="export-controls">
      <label htmlFor="duration">Exporter les</label>
      <input
        id="duration"
        type="number"
        min={1}
        value={duration}
        onChange={e => setDuration(+e.target.value)}
      />
      <select value={unit} onChange={e => setUnit(e.target.value as any)}>
        <option value="weeks">semaines</option>
        <option value="months">mois</option>
        <option value="years">années</option>
      </select>
      <button type="button" onClick={handleClick}>
        Télécharger
      </button>
    </div>
  );
};

export default ExportControls;
