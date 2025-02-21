import React from 'react';
import { Dinosaur } from '../../types/Dinosaur';
import './DinosaurInfo.css';
import Gauge from './utils/Gauge';
import StatModifierTooltip from './utils/StatModifierTooltip';

/**
 * Calcule l'âge du dinosaure en fonction de sa dernière renaissance.
 * @param lastReborn Date de la dernière renaissance.
 * @returns Chaîne indiquant l'âge.
 */
export function calculateDinosaurAge(lastReborn: Date): string {
  const lastRebornDate = new Date(lastReborn);
  const now = new Date();
  const diffInMilliseconds = now.getTime() - lastRebornDate.getTime();

  const days = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diffInMilliseconds / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diffInMilliseconds / (1000 * 60)) % 60);
  const seconds = Math.floor((diffInMilliseconds / 1000) % 60);

  return `${days} jours, ${hours} heures, ${minutes} min, ${seconds} sec`;
}

const DinosaurInfo: React.FC<{ dinosaur: Dinosaur }> = ({ dinosaur }) => {
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const computeBreakdown = (base: number, mods: any[]): { additive: number, multiplicative: number } => {
    let additive = 0;
    let multiplicative = 1;
    mods.forEach(mod => {
      if (mod.type === 'additive') {
        additive += mod.value;
      } else if (mod.type === 'multiplicative') {
        multiplicative *= (1 + mod.value);
      }
    });
    return { additive, multiplicative };
  };

  const formatBreakdown = (base: number, breakdown: { additive: number, multiplicative: number }, final: number): string => {
    const intermediate = base + breakdown.additive;
    return `${base} + ${breakdown.additive} = ${intermediate}; × ${breakdown.multiplicative.toFixed(2)} = ${final.toFixed(2)}`;
  };

  const energyModifiers = dinosaur.stats_modifiers.filter(mod => mod.target === "base_max_energy");
  const foodModifiers = dinosaur.stats_modifiers.filter(mod => mod.target === "base_max_food");
  const hungerModifiers = dinosaur.stats_modifiers.filter(mod => mod.target === "base_max_hunger");
  const xpModifiers = dinosaur.stats_modifiers.filter(mod => mod.target === "earn_experience_multiplier");
  const karmaModifiers = dinosaur.stats_modifiers.filter(mod => mod.target === "earn_karma_multiplier");
  const moneyModifiers = dinosaur.stats_modifiers.filter(mod => mod.target === "earn_money_multiplier");
  const skillPointModifiers = dinosaur.stats_modifiers.filter(mod => mod.target === "earn_skill_point_multiplier");

  const energyBreak = computeBreakdown(dinosaur.base_max_energy, energyModifiers);
  const foodBreak = computeBreakdown(dinosaur.base_max_food, foodModifiers);
  const hungerBreak = computeBreakdown(dinosaur.base_max_hunger, hungerModifiers);
  const xpBreak = computeBreakdown(1, xpModifiers);
  const karmaBreak = computeBreakdown(1, karmaModifiers);
  const moneyBreak = computeBreakdown(1, moneyModifiers);
  const skillPointBreak = computeBreakdown(1, skillPointModifiers);

  return (
    <div className="dinosaur-info">
      <h3>Dinosaure : {dinosaur.name}</h3>
      <p>
        <strong>Régime alimentaire</strong> : {capitalizeFirstLetter(dinosaur.diet.name)}
      </p>
      <p>
        <strong>Type</strong> : {capitalizeFirstLetter(dinosaur.type.name)}
      </p>

      <Gauge
        label="Énergie"
        current={dinosaur.energy}
        max={dinosaur.final_max_energy}
        color="#4CAF50"
        tooltipText={`Récupération : ${dinosaur.final_energy_recovery}/s, Décroissance : ${dinosaur.final_energy_decay}/s`}
        statModifiers={energyModifiers}
        baseValue={dinosaur.base_max_energy}
      />
      <Gauge
        label="Nourriture"
        current={dinosaur.food}
        max={dinosaur.final_max_food}
        color="#FF9800"
        tooltipText={`Multiplicateurs : Global ${dinosaur.final_earn_food_global_multiplier}x, Herbi ${dinosaur.final_earn_food_herbi_multiplier}x, Carni ${dinosaur.final_earn_food_carni_multiplier}x`}
        statModifiers={foodModifiers}
        baseValue={dinosaur.base_max_food}
      />
      <Gauge
        label="Faim"
        current={dinosaur.hunger}
        max={dinosaur.final_max_hunger}
        color="#F44336"
        tooltipText={`Augmentation : ${dinosaur.final_hunger_increase}/s`}
        statModifiers={hungerModifiers}
        baseValue={dinosaur.base_max_hunger}
      />

      <p><strong>Âge</strong> : {calculateDinosaurAge(dinosaur.last_reborn)}</p>
      <p><strong>Époque</strong> : {dinosaur.epoch}</p>
      <p><strong>Nombre de renaissances</strong> : {dinosaur.reborn_amount}</p>
      <div className="text-stats">
        <div className="stat-item">
          <span><strong>Karma</strong> : {dinosaur.karma}</span>
          <div className="stat-tooltip">
            <StatModifierTooltip statName="Karma" modifiers={karmaModifiers} baseValue={1} />
          </div>
        </div>
        <div className="stat-item">
          <span><strong>Argent</strong> : {dinosaur.money} €</span>
          <div className="stat-tooltip">
            <StatModifierTooltip statName="Argent" modifiers={moneyModifiers} baseValue={1} />
          </div>
        </div>
        <div className="stat-item">
          <span><strong>Points de compétences</strong> : {dinosaur.skill_points}</span>
          <div className="stat-tooltip">
            <StatModifierTooltip statName="Points de compétences" modifiers={skillPointModifiers} baseValue={1} />
          </div>
        </div>
      </div>
      <p className="notDisplayed">
        <strong>Créé le </strong>: {new Date(dinosaur.created_at).toLocaleDateString()}
      </p>
      <p className="notDisplayed">
        <strong>Dernière mise à jour</strong> : {new Date(dinosaur.last_update_by_time_service).toLocaleDateString()}
      </p>
      <p><strong>En Sommeil</strong> : {dinosaur.is_sleeping ? 'Oui' : 'Non'}</p>
      <p><strong>Mort</strong> : {dinosaur.is_dead ? 'Oui' : 'Non'}</p>
    </div>
  );
};

export default DinosaurInfo;
