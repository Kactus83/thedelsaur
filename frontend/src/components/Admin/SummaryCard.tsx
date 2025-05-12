import React from 'react';
import './SummaryCard.css';

interface Props {
  title: string;
  subtitle: string;
  primaryLabel: string;
  onPrimary: () => void;
  secondaryLabel?: string;
  onSecondary?: () => void;
}

const SummaryCard: React.FC<Props> = ({
  title, subtitle, primaryLabel, onPrimary, secondaryLabel, onSecondary
}) => (
  <div className="summary-card">
    <h3>{title}</h3>
    <p>{subtitle}</p>
    <div className="actions">
      <button onClick={onPrimary}>{primaryLabel}</button>
      {secondaryLabel && onSecondary && (
        <button className="secondary" onClick={onSecondary}>{secondaryLabel}</button>
      )}
    </div>
  </div>
);

export default SummaryCard;