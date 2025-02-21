import React from 'react';
import './StatModifierTooltip.css';
import { StatModifier } from '../../../types/stats-modifiers.types';

interface StatModifierTooltipProps {
  statName: string;
  modifiers: StatModifier[];
  baseValue: number;
}

/**
 * Calcule la décomposition du calcul à partir d'une valeur de base et d'une liste de modifiers.
 * La formule appliquée est : (base + somme additive) × (produit de (1 + chaque multiplicatif))
 * Retourne une chaîne du type : "base + additive = intermédiaire; × multiplicatif = final"
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
 * Pour chaque source, on somme les valeurs additifs et on calcule le produit des facteurs multiplicatifs.
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

/**
 * Affiche le détail du calcul et la liste des modifiers appliqués.
 */
const StatModifierTooltip: React.FC<StatModifierTooltipProps> = ({ statName, modifiers, baseValue }) => {
  const breakdown = computeCalculationBreakdown(baseValue, modifiers);
  const aggregation = aggregateModifiers(modifiers);

  return (
    <div className="stat-modifier-tooltip">
      <h4>Détails pour {statName}</h4>
      <p className="calculation-breakdown">{breakdown}</p>
      {modifiers.length === 0 ? (
        <div className="no-modifiers">Aucun modifier appliqué.</div>
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
  );
};

export default StatModifierTooltip;
