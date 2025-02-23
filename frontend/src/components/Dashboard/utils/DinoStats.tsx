import React from 'react';
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

const DinoStats: React.FC<{ dinosaur: Dinosaur }> = ({ dinosaur }) => {
  const { openStatDetail } = useOverlay();

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

  return (
    <div className="dino-stats-container">
      <div className="dino-stats-grid">
        {/* Argent */}
        <div className="stat-item" onClick={() => openStatDetail(ClickableStatTarget.MONEY)}>
          <div className="stat-content">
            <span className="stat-icon">{statMoney.icon}</span>
            <span className="stat-label">{statMoney.label}</span>
            <span className="stat-value">{statMoney.value}</span>
          </div>
          <div className="item-info">❓</div>
        </div>
        {/* Compétence */}
        <div className="stat-item" onClick={() => openStatDetail(ClickableStatTarget.COMPETENCE)}>
          <div className="stat-content">
            <span className="stat-icon">{statSkill.icon}</span>
            <span className="stat-label">{statSkill.label}</span>
            <span className="stat-value">{statSkill.value}</span>
          </div>
          <div className="item-info">❓</div>
        </div>
        {/* Armes */}
        <div className="stat-item" onClick={() => openStatDetail(ClickableStatTarget.WEAPONS)}>
          <div className="stat-content">
            <span className="stat-icon">{statWeapon.icon}</span>
            <span className="stat-label">{statWeapon.label}</span>
            <span className="stat-value">{statWeapon.value}</span>
          </div>
          <div className="item-info">❓</div>
        </div>
        {/* Armures */}
        <div className="stat-item" onClick={() => openStatDetail(ClickableStatTarget.ARMORS)}>
          <div className="stat-content">
            <span className="stat-icon">{statArmor.icon}</span>
            <span className="stat-label">{statArmor.label}</span>
            <span className="stat-value">{statArmor.value}</span>
          </div>
          <div className="item-info">❓</div>
        </div>
        {/* Amis */}
        <div className="stat-item" onClick={() => openStatDetail(ClickableStatTarget.FRIENDS)}>
          <div className="stat-content">
            <span className="stat-icon">{statFriends.icon}</span>
            <span className="stat-label">{statFriends.label}</span>
            <span className="stat-value">{statFriends.value}</span>
          </div>
          <div className="item-info">❓</div>
        </div>
        {/* Employés */}
        <div className="stat-item" onClick={() => openStatDetail(ClickableStatTarget.EMPLOYEES)}>
          <div className="stat-content">
            <span className="stat-icon">{statEmployees.icon}</span>
            <span className="stat-label">{statEmployees.label}</span>
            <span className="stat-value">{statEmployees.value}</span>
          </div>
          <div className="item-info">❓</div>
        </div>
      </div>
    </div>
  );
};

export default DinoStats;