import React, { useState } from 'react';
import './StatModifierTooltip.css';
import { StatModifier } from '../../../types/stats-modifiers.types';

interface StatModifierTooltipProps {
  statName: string;
  modifiers: StatModifier[];
  baseValue: number;
}

/**
 * Calcule la décomposition du calcul à partir d'une valeur de base et d'une liste de modificateurs.
 * Formule : (base + somme des additifs) × (produit de (1 + multiplicatifs))
 * Retourne une chaîne explicative.
 */
const computeCalculationBreakdown = (base: number, modifiers: StatModifier[]): string => {
  let additive = 0;
  let multiplicative = 1;
  modifiers.forEach(mod => {
    if (mod.type === 'additive') {
      additive += mod.value;
    } else if (mod.type === 'multiplicative') {
      multiplicative *= (1 + mod.value);
    }
  });
  const intermediate = base + additive;
  const final = intermediate * multiplicative;
  return `${base} + ${additive} = ${intermediate}; × ${multiplicative.toFixed(2)} = ${final.toFixed(2)}`;
};

/**
 * Agrège les modificateurs par source.
 */
const aggregateModifiers = (modifiers: StatModifier[]) => {
  const aggregation: { [source: string]: { additive: number; multiplicative: number } } = {};
  modifiers.forEach(mod => {
    if (!aggregation[mod.source]) {
      aggregation[mod.source] = { additive: 0, multiplicative: 1 };
    }
    if (mod.type === 'additive') {
      aggregation[mod.source].additive += mod.value;
    } else if (mod.type === 'multiplicative') {
      aggregation[mod.source].multiplicative *= (1 + mod.value);
    }
  });
  return aggregation;
};

const StatModifierTooltip: React.FC<StatModifierTooltipProps> = ({ statName, modifiers, baseValue }) => {
  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => setVisible(prev => !prev);

  const breakdown = computeCalculationBreakdown(baseValue, modifiers);
  const aggregation = aggregateModifiers(modifiers);

  return (
    <div className="tooltip-container" onClick={toggleVisibility}>
      {visible && (
        <div className="stat-modifier-tooltip">
          <h4>Détails pour {statName}</h4>
          <p className="calculation-breakdown">{breakdown}</p>
          {modifiers.length === 0 ? (
            <div className="no-modifiers">Aucun modificateur appliqué.</div>
          ) : (
            <div className="aggregation">
              <div className="aggregation-column">
                <div className="column-title">Additifs</div>
                {Object.entries(aggregation).map(([source, agg]) => (
                  <div key={source} className="aggregation-row">
                    <span className="agg-source">{source}</span>
                    <span className="agg-value">{agg.additive}</span>
                  </div>
                ))}
              </div>
              <div className="aggregation-column">
                <div className="column-title">Multiplicatifs</div>
                {Object.entries(aggregation).map(([source, agg]) => (
                  <div key={source} className="aggregation-row">
                    <span className="agg-source">{source}</span>
                    <span className="agg-value">{agg.multiplicative.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StatModifierTooltip;
