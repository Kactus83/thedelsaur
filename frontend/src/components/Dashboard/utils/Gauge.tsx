import React, { useState } from 'react';
import './Gauge.css';
import StatModifierTooltip from './StatModifierTooltip';
import { StatModifier } from '../../../types/stats-modifiers.types';

interface GaugeProps {
  label: string;
  current: number;
  max: number;
  tooltipText?: string;
  color?: string;
  statModifiers?: StatModifier[];
  baseValue?: number;
}

const Gauge: React.FC<GaugeProps> = ({ label, current, max, tooltipText = '', color = '#4CAF50', statModifiers, baseValue }) => {
  const [hoverBar, setHoverBar] = useState(false);
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className="gauge">
      <span className="gauge-label">{label}</span>
      <div 
        className="gauge-bar"
        onMouseEnter={() => setHoverBar(true)}
        onMouseLeave={() => setHoverBar(false)}
      >
        <div
          className="gauge-fill"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        ></div>
        {hoverBar && statModifiers && statModifiers.length > 0 && baseValue !== undefined && (
          <div className="tooltip-detail">
            <StatModifierTooltip statName={label} modifiers={statModifiers} baseValue={baseValue} />
          </div>
        )}
      </div>
      <span className="gauge-text">{current} / {max}</span>
      {tooltipText && (
        <div className="tooltip-text">
          {tooltipText}
        </div>
      )}
    </div>
  );
};

export default Gauge;
