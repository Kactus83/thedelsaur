import { foodSkills } from './skills/food.skills';
import { energySkills } from './skills/energy.skills';
import { moneySkills } from './skills/money.skills';
import { karmaSkills } from './skills/karma.skills';
import { experienceSkills } from './skills/experience.skills';

import { consumableFoodItems } from './items/consumable.items.food';
import { consumableEnergyItems } from './items/consumable.items.energy';
import { consumableMoneyItems } from './items/consumable.items.money';
import { consumableKarmaItems } from './items/consumable.items.karma';
import { consumableExperienceItems } from './items/consumable.items.experience';

import { persistentEnergyItems } from './items/persistent.items.energy';
import { persistentFoodItems } from './items/persistent.items.food';
import { persistentMoneyItems } from './items/persistent.items.money';
import { persistentKarmaItems } from './items/persistent.items.karma';
import { persistentExperienceItems } from './items/persistent.items.experience';

import { allBuildingsMapping } from './buildings/game-assets.buildings.mapping';

/**
 * Agrégation complète des définitions de Game Assets.
 */
export const GameAssetsMapping = {
  skills: [...foodSkills, ...energySkills, ...moneySkills, ...karmaSkills, ...experienceSkills],
  items: {
    consumable: [
      ...consumableFoodItems,
      ...consumableEnergyItems,
      ...consumableMoneyItems,
      ...consumableKarmaItems,
      ...consumableExperienceItems
    ],
    persistent: [
      ...persistentEnergyItems,
      ...persistentFoodItems,
      ...persistentMoneyItems,
      ...persistentKarmaItems,
      ...persistentExperienceItems
    ]
  },
  buildings: allBuildingsMapping
};
