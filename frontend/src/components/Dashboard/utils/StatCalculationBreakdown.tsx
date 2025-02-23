import React from 'react';
import { StatModifier } from '../../../types/stats-modifiers.types';
import './StatCalculationBreakdown.css';

interface StatCalculationBreakdownProps {
  label: string;
  base: number;
  modifiers: StatModifier[];
}

const StatCalculationBreakdown: React.FC<StatCalculationBreakdownProps> = ({ label, base, modifiers }) => {
  console.log('StatCalculationBreakdown', label, base, modifiers);
  // Calcul des modificateurs additifs
  const additiveModifiers = modifiers.filter(mod => mod.type === 'additive');
  const additiveTotal = additiveModifiers.reduce((sum, mod) => sum + mod.value, 0);
  
  // Calcul des modificateurs multiplicatifs
  const multiplicativeModifiers = modifiers.filter(mod => mod.type === 'multiplicative');
  const multiplicativeFactor = multiplicativeModifiers.reduce((prod, mod) => prod * (1 + mod.value), 1);

  const subtotal = base + additiveTotal;
  const finalValue = subtotal * multiplicativeFactor;

  return (
    <div className="stat-breakdown">
      <h3>{label}</h3>
      <div className="breakdown-section">
        <strong>Valeur de base :</strong> {base}
      </div>
      {additiveModifiers.length > 0 && (
        <div className="breakdown-section">
          <strong>Additifs :</strong>
          <ul>
            {additiveModifiers.map((mod, index) => (
              <li key={index}>
                {mod.source} : +{mod.value}
              </li>
            ))}
          </ul>
          <div>Sous-total (base + additifs) : {subtotal}</div>
        </div>
      )}
      {multiplicativeModifiers.length > 0 && (
        <div className="breakdown-section">
          <strong>Multiplicatifs :</strong>
          <ul>
            {multiplicativeModifiers.map((mod, index) => (
              <li key={index}>
                {mod.source} : {(mod.value * 100).toFixed(1)}%
              </li>
            ))}
          </ul>
          <div>Facteur multiplicatif : {multiplicativeFactor.toFixed(2)}</div>
        </div>
      )}
      <div className="breakdown-section final">
        <strong>Valeur finale :</strong> {finalValue.toFixed(2)}
      </div>
    </div>
  );
};

export default StatCalculationBreakdown;