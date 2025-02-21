import React from 'react';
import './Gauge_XP.css';

interface GaugeXPProps {
  label: string;
  current: number;
  max: number;
  tooltipText?: string;
  color?: string;
  calculationBreakdown?: string;
}

const Gauge_XP: React.FC<GaugeXPProps> = ({ label, current, max, tooltipText = '', color = '#4CAF50', calculationBreakdown }) => {
  const percentage = Math.min((current / max) * 100, 100);

  return (
    <div className="gaugexp">
      <span className="gauge-xplabel">{label}</span>
      <div className="gauge-xpbar">
        <div
          className="gauge-xpfill"
          style={{ width: `${percentage}%`, backgroundColor: color }}
        ></div>
      </div>
      <span className="gauge-xptext">{current} / {max}</span>
      {tooltipText && (
        <div className="tooltip-xptext">
          {tooltipText}
        </div>
      )}
      {calculationBreakdown && (
        <div className="tooltip-xpdetail">
          {calculationBreakdown}
        </div>
      )}
    </div>
  );
};

export default Gauge_XP;
