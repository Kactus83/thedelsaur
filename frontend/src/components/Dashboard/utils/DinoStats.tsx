import React, { useState } from 'react';
import './DinoStats.css';
import { Dinosaur } from '../../../types/Dinosaur';

interface StatMapping {
  label: string;
  icon: string;
  base: number;
  value: number;
  modifiers: any[];
}

interface StatCouple {
  stat1: StatMapping;
  stat2: StatMapping;
}

interface DinoStatsProps {
  dinosaur: Dinosaur;
}

/**
 * Calcule le breakdown d'une stat.
 * Formule : (base + somme des additifs) × (produit de (1 + chaque multiplicatif))
 * Retourne les valeurs additive, multiplicative et le résultat final.
 */
const computeBreakdown = (
  base: number,
  modifiers: any[]
): { additive: number; multiplicative: number; final: number } => {
  let additive = 0;
  let multiplicative = 1;
  modifiers.forEach(mod => {
    if (mod.type === 'additive') {
      additive += mod.value;
    } else if (mod.type === 'multiplicative') {
      multiplicative *= (1 + mod.value);
    }
  });
  const final = (base + additive) * multiplicative;
  return { additive, multiplicative, final };
};

const DinoStats: React.FC<DinoStatsProps> = ({ dinosaur }) => {
  // Définition des indicateurs à afficher (hors Karma)
  const statMoney: StatMapping = {
    label: 'Argent',
    icon: '💰',
    base: 1,
    value: dinosaur.money,
    modifiers: dinosaur.stats_modifiers.filter(mod => mod.target === 'earn_money_multiplier')
  };

  const statSkill: StatMapping = {
    label: 'Compétence',
    icon: '⭐',
    base: 1,
    value: dinosaur.skill_points,
    modifiers: dinosaur.stats_modifiers.filter(mod => mod.target === 'earn_skill_point_multiplier')
  };

  const statWeapon: StatMapping = {
    label: 'Armes',
    icon: '⚔️',
    base: 0,
    value: dinosaur.weapons,
    modifiers: dinosaur.stats_modifiers.filter(mod => mod.target === 'weapon_production')
  };

  const statArmor: StatMapping = {
    label: 'Armures',
    icon: '🛡️',
    base: 0,
    value: dinosaur.armors,
    modifiers: dinosaur.stats_modifiers.filter(mod => mod.target === 'armor_production')
  };

  const statFriends: StatMapping = {
    label: 'Amis',
    icon: '🤝',
    base: 0,
    value: dinosaur.friends,
    modifiers: dinosaur.stats_modifiers.filter(mod => mod.target === 'friend_production')
  };

  const statEmployees: StatMapping = {
    label: 'Employés',
    icon: '👥',
    base: 0,
    value: dinosaur.employees,
    modifiers: dinosaur.stats_modifiers.filter(mod => mod.target === 'employee_production')
  };

  // Regroupement en trois couples
  const couples: StatCouple[] = [
    { stat1: statMoney, stat2: statSkill },
    { stat1: statWeapon, stat2: statArmor },
    { stat1: statFriends, stat2: statEmployees }
  ];

  // State pour gérer l'affichage du détail pour chaque stat (6 items au total)
  const [visibleDetails, setVisibleDetails] = useState<boolean[]>(Array(6).fill(false));

  const toggleDetail = (index: number) => {
    const newVisible = [...visibleDetails];
    newVisible[index] = !newVisible[index];
    setVisibleDetails(newVisible);
  };

  return (
    <div className="dino-stats-container">
      <div className="dino-stats-grid">
        {couples.map((couple, coupleIndex) => (
          <div key={coupleIndex} className="stat-couple">
            {/* Stat item 1 */}
            <div className="stat-item">
              <div className="stat-content">
                <span className="stat-icon">{couple.stat1.icon}</span>
                <span className="stat-label">{couple.stat1.label}</span>
                <span className="stat-value">{couple.stat1.value}</span>
              </div>
              <div className="item-info" onClick={() => toggleDetail(coupleIndex * 2)}>
                ❓
              </div>
            </div>
            {visibleDetails[coupleIndex * 2] && (
              <div className="stat-breakdown">
                <strong>{couple.stat1.label}:</strong>{' '}
                {couple.stat1.base} +{' '}
                {computeBreakdown(couple.stat1.base, couple.stat1.modifiers).additive} ={' '}
                {couple.stat1.base + computeBreakdown(couple.stat1.base, couple.stat1.modifiers).additive}; ×{' '}
                {computeBreakdown(couple.stat1.base, couple.stat1.modifiers).multiplicative.toFixed(2)} ={' '}
                {computeBreakdown(couple.stat1.base, couple.stat1.modifiers).final.toFixed(2)}
              </div>
            )}

            {/* Stat item 2 */}
            <div className="stat-item">
              <div className="stat-content">
                <span className="stat-icon">{couple.stat2.icon}</span>
                <span className="stat-label">{couple.stat2.label}</span>
                <span className="stat-value">{couple.stat2.value}</span>
              </div>
              <div className="item-info" onClick={() => toggleDetail(coupleIndex * 2 + 1)}>
                ❓
              </div>
            </div>
            {visibleDetails[coupleIndex * 2 + 1] && (
              <div className="stat-breakdown">
                <strong>{couple.stat2.label}:</strong>{' '}
                {couple.stat2.base} +{' '}
                {computeBreakdown(couple.stat2.base, couple.stat2.modifiers).additive} ={' '}
                {couple.stat2.base + computeBreakdown(couple.stat2.base, couple.stat2.modifiers).additive}; ×{' '}
                {computeBreakdown(couple.stat2.base, couple.stat2.modifiers).multiplicative.toFixed(2)} ={' '}
                {computeBreakdown(couple.stat2.base, couple.stat2.modifiers).final.toFixed(2)}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DinoStats;
