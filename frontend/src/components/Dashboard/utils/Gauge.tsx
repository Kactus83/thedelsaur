import React from 'react';
import './Gauge.css';

interface GaugeProps {
    label: string;
    current: number;
    max: number;
    tooltipText?: string; // Ajout de texte pour le tooltip
    color?: string; // Couleur optionnelle
}

const Gauge: React.FC<GaugeProps> = ({ label, current, max, tooltipText = '', color = '#4CAF50' }) => {
    const percentage = Math.min((current / max) * 100, 100);

    return (
        <div className="gauge tooltip">
            <span className="gauge-label">{label}</span>
            <div className="gauge-bar">
                <div
                    className="gauge-fill"
                    style={{ width: `${percentage}%`, backgroundColor: color }}
                ></div>
            </div>
            <span className="gauge-text">{current} / {max}</span>
            {tooltipText && <span className="tooltip-text">{tooltipText}</span>}
        </div>
    );
};

export default Gauge;
