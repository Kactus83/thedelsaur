import React, { useEffect, useState } from 'react';
import './DinoStats.css';
import { Dinosaur } from '../../../types/Dinosaur';
import { useOverlay } from '../../../contexts/OverlayContext';
import { ClickableStatTarget } from '../../../types/ClickableStatTarget';

interface StatMapping {
  label: string;
  icon: string;
  base: number;
  value: number;
  modifiers: any[];
}

const formatNumber = (num: number): string => {
  if (num >= 1e9) return (num / 1e9).toFixed(1) + 'B';
  if (num >= 1e6) return (num / 1e6).toFixed(1) + 'M';
  if (num >= 1e3) return (num / 1e3).toFixed(1) + 'K';
  return num.toString();
};

interface AnimatedNumberProps {
  value: number;
}

const AnimatedNumber: React.FC<AnimatedNumberProps> = ({ value }) => {
  const [displayValue, setDisplayValue] = useState(value);

  useEffect(() => {
    const start = displayValue;
    const end = value;
    const duration = 800; // durée de l'animation en ms
    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const current = start + (end - start) * progress;
      setDisplayValue(current);
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span className="stat-value">{formatNumber(displayValue)}</span>;
};

const DinoStats: React.FC<{ dinosaur: Dinosaur }> = ({ dinosaur }) => {
  const { openStatDetail } = useOverlay();

  const statMoney: StatMapping = {
    label: 'ARGENT',
    icon: '💰',
    base: 1,
    value: dinosaur.money,
    modifiers: dinosaur.stats_modifiers.filter(mod => mod.target === 'earn_money_multiplier')
  };

  const statSkill: StatMapping = {
    label: 'SKILL',
    icon: '⭐',
    base: 1,
    value: dinosaur.skill_points,
    modifiers: dinosaur.stats_modifiers.filter(mod => mod.target === 'earn_skill_point_multiplier')
  };

  const statWeapon: StatMapping = {
    label: 'ARMES',
    icon: '⚔️',
    base: 0,
    value: dinosaur.weapons,
    modifiers: dinosaur.stats_modifiers.filter(mod => mod.target === 'weapon_production')
  };

  const statArmor: StatMapping = {
    label: 'ARMURES',
    icon: '🛡️',
    base: 0,
    value: dinosaur.armors,
    modifiers: dinosaur.stats_modifiers.filter(mod => mod.target === 'armor_production')
  };

  const statFriends: StatMapping = {
    label: 'AMIS',
    icon: '🤝',
    base: 0,
    value: dinosaur.friends,
    modifiers: dinosaur.stats_modifiers.filter(mod => mod.target === 'friend_production')
  };

  const statEmployees: StatMapping = {
    label: 'EMPLOYÉS',
    icon: '👥',
    base: 0,
    value: dinosaur.employees,
    modifiers: dinosaur.stats_modifiers.filter(mod => mod.target === 'employee_production')
  };

  return (
    <div className="dino-stats-container">
      <div className="dino-stats-grid">
        {/* Groupe 1 : Argent et Compétence */}
        <div className="stat-group" onClick={() => openStatDetail(ClickableStatTarget.MONEY)}>
          <div className="stat-item">
            <div className="stat-icon">{statMoney.icon}</div>
            <div className="stat-label">{statMoney.label}</div>
            <div className="stat-value-wrapper">
              <AnimatedNumber value={statMoney.value} />
              <span className="item-info">❓</span>
            </div>
          </div>
          <div className="stat-item" onClick={() => openStatDetail(ClickableStatTarget.COMPETENCE)}>
            <div className="stat-icon">{statSkill.icon}</div>
            <div className="stat-label">{statSkill.label}</div>
            <div className="stat-value-wrapper">
              <AnimatedNumber value={statSkill.value} />
              <span className="item-info">❓</span>
            </div>
          </div>
        </div>
        {/* Groupe 2 : Armes et Armures */}
        <div className="stat-group" onClick={() => openStatDetail(ClickableStatTarget.WEAPONS)}>
          <div className="stat-item">
            <div className="stat-icon">{statWeapon.icon}</div>
            <div className="stat-label">{statWeapon.label}</div>
            <div className="stat-value-wrapper">
              <AnimatedNumber value={statWeapon.value} />
              <span className="item-info">❓</span>
            </div>
          </div>
          <div className="stat-item" onClick={() => openStatDetail(ClickableStatTarget.ARMORS)}>
            <div className="stat-icon">{statArmor.icon}</div>
            <div className="stat-label">{statArmor.label}</div>
            <div className="stat-value-wrapper">
              <AnimatedNumber value={statArmor.value} />
              <span className="item-info">❓</span>
            </div>
          </div>
        </div>
        {/* Groupe 3 : Amis */}
        <div className="stat-group" onClick={() => openStatDetail(ClickableStatTarget.FRIENDS)}>
          <div className="stat-item">
            <div className="stat-icon">{statFriends.icon}</div>
            <div className="stat-label">{statFriends.label}</div>
            <div className="stat-value-wrapper">
              <AnimatedNumber value={statFriends.value} />
              <span className="item-info">❓</span>
            </div>
          </div>
          <div className="stat-item">
            <div className="stat-icon">{statEmployees.icon}</div>
            <div className="stat-label">{statEmployees.label}</div>
            <div className="stat-value-wrapper">
              <AnimatedNumber value={statEmployees.value} />
              <span className="item-info">❓</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DinoStats;
