import { DinosaurSkillDTO } from '../../models/dinosaur-skill.dto';
import { DinosaurSkillCategory, DinosaurSkillType } from '../../models/dinosaur-skill.enums';

/**
 * Skills de la catégorie "Money"
 */
export const moneySkills: DinosaurSkillDTO[] = [
  {
    id: 0,
    name: "Earn 100% Money",
    description: "Augmente de façon permanente la production de monnaie.",
    price: 600,
    minLevelToBuy: 1,
    category: DinosaurSkillCategory.Money,
    type: DinosaurSkillType.Permanent,
    tier: 1,
    statModifiers: [
      { source: "skill", target: "earn_money_multiplier", type: "multiplicative", value: 1 }
    ]
  }
];
