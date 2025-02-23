import React from 'react';
import { Dinosaur } from '../../../types/Dinosaur';
import { ClickableStatTarget } from '../../../types/ClickableStatTarget';
import './ClickableStatDetailOverlay.css';
import StatCalculationBreakdown from '../utils/StatCalculationBreakdown';

interface ClickableStatDetailOverlayProps {
  dinosaur: Dinosaur;
  target: ClickableStatTarget;
  onClose: () => void;
}

const ClickableStatDetailOverlay: React.FC<ClickableStatDetailOverlayProps> = ({ dinosaur, target, onClose }) => {
  const renderCalculationDetails = () => {
    switch(target) {
      case ClickableStatTarget.ENERGY_GAUGE: {
        // Pour la jauge d'énergie (corps de la barre)
        const decayBase = dinosaur.energy_decay_per_second;
        const decayModifiers = dinosaur.stats_modifiers.filter(mod => mod.target === "energy_decay_multiplier");
        
        // La récupération d'énergie se décompose en deux segments : jour et nuit.
        // La base commune est energy_recovery_per_second, ajustée à 70% pour le jour et 130% pour la nuit.
        const recoveryBase = dinosaur.energy_recovery_per_second;
        const recoveryDayBase = recoveryBase * 0.7;
        const recoveryNightBase = recoveryBase * 1.3;
        const recoveryModifiers = dinosaur.stats_modifiers.filter(mod => mod.target === "energy_recovery_multiplier");

        return (
          <div className="stat-details-container">
            <h3>Énergie – Détails</h3>
            <StatCalculationBreakdown label="Decay" base={decayBase} modifiers={decayModifiers} />
            <StatCalculationBreakdown label="Récupération (jour)" base={recoveryDayBase} modifiers={recoveryModifiers} />
            <StatCalculationBreakdown label="Récupération (nuit)" base={recoveryNightBase} modifiers={recoveryModifiers} />
          </div>
        );
      }
      case ClickableStatTarget.ENERGY_GAUGE_TEXT: {
        const base = dinosaur.base_max_energy;
        const modifiers = dinosaur.stats_modifiers.filter(mod => mod.target === "base_max_energy");
        return <StatCalculationBreakdown label="Énergie Maximum" base={base} modifiers={modifiers} />;
      }
      case ClickableStatTarget.FOOD_GAUGE: {
        const base = 0;
        const modifiers = dinosaur.stats_modifiers.filter(mod => mod.target === "food_production");
        return <StatCalculationBreakdown label="Production de Nourriture" base={base} modifiers={modifiers} />;
      }
      case ClickableStatTarget.FOOD_GAUGE_TEXT: {
        const base = dinosaur.base_max_food;
        const modifiers = dinosaur.stats_modifiers.filter(mod => mod.target === "base_max_food");
        return <StatCalculationBreakdown label="Nourriture Maximum" base={base} modifiers={modifiers} />;
      }
      case ClickableStatTarget.HUNGER_GAUGE: {
        // Pour la jauge de faim, afficher la progression diurne et nocturne.
        const hungerDayBase = dinosaur.hunger_increase_per_second;
        const hungerNightBase = dinosaur.hunger_increase_per_second_when_recovery;
        const hungerModifiers = dinosaur.stats_modifiers.filter(mod => mod.target === "hunger_increase_multiplier");
        return (
          <div className="stat-details-container">
            <h3>Faim – Détails</h3>
            <StatCalculationBreakdown label="Augmentation (jour)" base={hungerDayBase} modifiers={hungerModifiers} />
            <StatCalculationBreakdown label="Augmentation (nuit)" base={hungerNightBase} modifiers={hungerModifiers} />
          </div>
        );
      }
      case ClickableStatTarget.HUNGER_GAUGE_TEXT: {
        const base = dinosaur.base_max_hunger;
        const modifiers = dinosaur.stats_modifiers.filter(mod => mod.target === "base_max_hunger");
        return <StatCalculationBreakdown label="Faim Maximum" base={base} modifiers={modifiers} />;
      }
      case ClickableStatTarget.KARMA_GAUGE: {
        const base = 1;
        const modifiers = dinosaur.stats_modifiers.filter(mod => mod.target === "earn_karma_multiplier");
        return <StatCalculationBreakdown label="Multiplicateur de Karma" base={base} modifiers={modifiers} />;
      }
      case ClickableStatTarget.KARMA_GAUGE_TEXT: {
        const base = dinosaur.karma_width;
        const modifiers: any[] = [];
        return <StatCalculationBreakdown label="Karma Maximum" base={base} modifiers={modifiers} />;
      }
      case ClickableStatTarget.EXPERIENCE_GAUGE_TEXT: {
        const base = 0;
        const modifiers = dinosaur.stats_modifiers.filter(mod => mod.target === "earn_experience_multiplier");
        return <StatCalculationBreakdown label="Multiplicateur d'Expérience" base={base} modifiers={modifiers} />;
      }
      case ClickableStatTarget.EXPERIENCE_GAUGE: {
        return <div>Affichage des calculs pour la jauge d'expérience (barre).</div>;
      }
      case ClickableStatTarget.MONEY: {
        const base = 1;
        const modifiers = dinosaur.stats_modifiers.filter(mod => mod.target === "earn_money_multiplier");
        return <StatCalculationBreakdown label="Argent" base={base} modifiers={modifiers} />;
      }
      case ClickableStatTarget.COMPETENCE: {
        const base = 1;
        const modifiers = dinosaur.stats_modifiers.filter(mod => mod.target === "earn_skill_point_multiplier");
        return <StatCalculationBreakdown label="Compétence" base={base} modifiers={modifiers} />;
      }
      case ClickableStatTarget.WEAPONS: {
        const base = 0;
        const modifiers = dinosaur.stats_modifiers.filter(mod => mod.target === "weapon_production");
        return <StatCalculationBreakdown label="Armes" base={base} modifiers={modifiers} />;
      }
      case ClickableStatTarget.ARMORS: {
        const base = 0;
        const modifiers = dinosaur.stats_modifiers.filter(mod => mod.target === "armor_production");
        return <StatCalculationBreakdown label="Armures" base={base} modifiers={modifiers} />;
      }
      case ClickableStatTarget.FRIENDS: {
        const base = 0;
        const modifiers = dinosaur.stats_modifiers.filter(mod => mod.target === "friend_production");
        return <StatCalculationBreakdown label="Amis" base={base} modifiers={modifiers} />;
      }
      case ClickableStatTarget.EMPLOYEES: {
        const base = 0;
        const modifiers = dinosaur.stats_modifiers.filter(mod => mod.target === "employee_production");
        return <StatCalculationBreakdown label="Employés" base={base} modifiers={modifiers} />;
      }
      default:
        return <div>Aucun détail disponible pour cet élément</div>;
    }
  };

  return (
    <div className="clickable-stat-overlay">
      <div className="overlay-content">
        <button className="close-button" onClick={onClose}>&times;</button>
        <h2>Détails pour {target}</h2>
        {renderCalculationDetails()}
      </div>
    </div>
  );
};

export default ClickableStatDetailOverlay;