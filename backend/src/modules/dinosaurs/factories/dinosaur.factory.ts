import { DINOSAUR_CONSTANTS } from '../../../common/config/dinosaur.constants';
import { DatabaseDinosaur } from '../models/database-dinosaur.interface';
import { DinosaurType } from '../models/dinosaur-type.interface';
import { DinosaurDiet } from '../models/dinosaur-diet.interface';
import { Epoch } from '../models/epoch.enum';
import { DinosaurRepository } from '../repositories/dinosaur.repository';
import { FrontendDinosaurDTO } from '../models/frontend-dinosaur.dto';
import { StatModifier } from '../models/stats-modifiers.types';

/**
 * Extrait la valeur d'un modificateur ciblant une propriété donnée.
 */
const getModifierValue = (
  modifiers: StatModifier[],
  target: string
): number => {
  const mod = modifiers.find(m => m.target === target);
  return mod ? mod.value : 0;
};

/**
 * Retourne un nom aléatoire pour un dinosaure.
 */
const generateRandomName = (): string => {
  const names: string[] = [
    'Rex', 'Bella', 'Spike', 'Tina', 'Dino', 'Luna',
    'Thor', 'Milo', 'Zara', 'Rocky', 'Sasha', 'Leo',
    'Nina', 'Gus', 'Ruby', 'Max', 'Maya', 'Oscar',
    'Charlie', 'Lily', 'Buddy', 'Molly', 'Jack', 'Daisy',
    'Toby', 'Sadie', 'Buster', 'Chloe', 'Bear', 'Coco',
    'Duke', 'Penny', 'Murphy', 'Rosie', 'Zeus', 'Gracie',
    'Sam', 'Abby'
  ];
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
};

/**
 * Calcule une statistique finale en appliquant les modificateurs.
 */
const calculateFinalStat = (base: number, modifiers: StatModifier[]): number => {
  let additive = 0;
  let multiplicative = 1;
  modifiers.forEach(mod => {
    if (mod.type === 'additive') {
      additive += mod.value;
    } else if (mod.type === 'multiplicative') {
      multiplicative *= (1 + mod.value);
    }
  });
  return (base + additive) * multiplicative;
};

/**
 * Retourne les modificateurs de niveau selon le niveau du dinosaure.
 */
const getLevelModifiers = (level: number): StatModifier[] => {
  if (level <= 1) return [];
  const factor = 0.05 * (level - 1);
  return [
    { source: "level", type: "multiplicative", value: factor, target: "base_max_energy" },
    { source: "level", type: "multiplicative", value: factor, target: "base_max_food" },
    { source: "level", type: "multiplicative", value: factor, target: "base_max_hunger" },
    { source: "level", type: "multiplicative", value: factor, target: "energy_recovery_multiplier" },
    { source: "level", type: "multiplicative", value: factor, target: "hunger_increase_multiplier" },
    // Autres modificateurs de niveau peuvent être ajoutés ici.
  ];
};

/**
 * Factory pour créer et convertir un dinosaure.
 * Cette classe est instanciée une seule fois avec le DinosaurRepository injecté.
 */
export class DinosaurFactory {
  private dinosaurRepo: DinosaurRepository;

  constructor(dinosaurRepo: DinosaurRepository) {
    this.dinosaurRepo = dinosaurRepo;
  }

  /**
   * Crée un nouvel objet DatabaseDinosaur prêt à être inséré en base.
   * Les assets sont initialisés à des tableaux vides.
   */
  public async createDinosaur(userId: number): Promise<DatabaseDinosaur> {
    const allTypes: DinosaurType[] = await this.dinosaurRepo.getAllDinosaurTypes();
    const allDiets: DinosaurDiet[] = await this.dinosaurRepo.getAllDinosaurDiets();

    // Sélection aléatoire
    const type: DinosaurType = allTypes[Math.floor(Math.random() * allTypes.length)];
    const diet: DinosaurDiet = allDiets[Math.floor(Math.random() * allDiets.length)];
    const name = generateRandomName();

    const energy = DINOSAUR_CONSTANTS.INITIAL_ENERGY;
    const food = DINOSAUR_CONSTANTS.INITIAL_FOOD;
    const hunger = DINOSAUR_CONSTANTS.INITIAL_HUNGER;

    const base_max_energy = DINOSAUR_CONSTANTS.BASE_MAX_ENERGY + getModifierValue(type.statModifiers, 'base_max_energy');
    const base_max_food = DINOSAUR_CONSTANTS.BASE_MAX_FOOD + getModifierValue(type.statModifiers, 'base_max_food');
    const base_max_hunger = DINOSAUR_CONSTANTS.BASE_MAX_HUNGER + getModifierValue(type.statModifiers, 'base_max_hunger');

    const dinosaur: DatabaseDinosaur = {
      id: 0,
      name,
      userId,
      type,
      diet,
      energy,
      food,
      hunger,
      karma: 0,
      experience: 0,
      level: 1,
      money: 0,
      skill_points: 0,
      epoch: Epoch.Ancient_Epoch1,
      base_max_energy,
      energy_decay_per_second: DINOSAUR_CONSTANTS.ENERGY_DECAY_PER_SECOND,
      energy_recovery_per_second: DINOSAUR_CONSTANTS.ENERGY_RECOVERY_PER_SECOND,
      base_max_food,
      base_max_hunger,
      hunger_increase_per_second: DINOSAUR_CONSTANTS.HUNGER_INCREASE_PER_SECOND,
      hunger_increase_per_second_when_recovery: DINOSAUR_CONSTANTS.HUNGER_INCREASE_PER_SECOND_WHEN_RECOVERY,
      karma_width: DINOSAUR_CONSTANTS.KARMA_WIDTH,
      created_at: new Date(),
      last_reborn: new Date(),
      reborn_amount: 0,
      last_update_by_time_service: new Date(),
      is_sleeping: false,
      is_dead: false,
      skills: [],
      items: [],
      buildings: []
    };

    return dinosaur;
  }

  /**
   * Convertit un DatabaseDinosaur en FrontendDinosaurDTO.
   * Intègre les modificateurs du type, diète, niveau, ainsi que ceux issus des assets.
   */
  public convertToFrontendDinosaur(dbDino: DatabaseDinosaur): FrontendDinosaurDTO {
    const levelModifiers = getLevelModifiers(dbDino.level);
    
    // Récupération des modificateurs issus du type et de la diète
    const baseModifiers: StatModifier[] = [
      ...dbDino.type.statModifiers,
      ...dbDino.diet.statModifiers,
      ...levelModifiers
    ];

    // Ajouter les modificateurs issus des assets
    const assetModifiers: StatModifier[] = [];

    if (dbDino.skills && dbDino.skills.length > 0) {
      dbDino.skills.forEach(skill => {
        // On suppose que chaque skill instance contient éventuellement une propriété statModifiers
        const s = skill as any;
        if (s.statModifiers && skill.isPurchased) {
          assetModifiers.push(...s.statModifiers);
        }
      });
    }
    if (dbDino.items && dbDino.items.length > 0) {
      dbDino.items.forEach(item => {
        const i = item as any;
        if (i.statModifiers) {
          assetModifiers.push(...i.statModifiers);
        }
      });
    }
    if (dbDino.buildings && dbDino.buildings.length > 0) {
      dbDino.buildings.forEach(building => {
        const b = building as any;
        if (b.statModifiers) {
          assetModifiers.push(...b.statModifiers);
        }
      });
    }

    const allModifiers = [...baseModifiers, ...assetModifiers];

    const final_max_energy = calculateFinalStat(dbDino.base_max_energy, allModifiers.filter(mod => mod.target === "base_max_energy"));
    const final_max_food = calculateFinalStat(dbDino.base_max_food, allModifiers.filter(mod => mod.target === "base_max_food"));
    const final_max_hunger = calculateFinalStat(dbDino.base_max_hunger, allModifiers.filter(mod => mod.target === "base_max_hunger"));
    const final_energy_recovery = calculateFinalStat(dbDino.energy_recovery_per_second, allModifiers.filter(mod => mod.target === "energy_recovery_multiplier"));
    const final_energy_decay = calculateFinalStat(dbDino.energy_decay_per_second, allModifiers.filter(mod => mod.target === "energy_decay_multiplier"));
    const final_hunger_increase = calculateFinalStat(dbDino.hunger_increase_per_second, allModifiers.filter(mod => mod.target === "hunger_increase_multiplier"));
    const final_hunger_increase_when_recovery = calculateFinalStat(dbDino.hunger_increase_per_second_when_recovery, allModifiers.filter(mod => mod.target === "hunger_increase_multiplier"));

    const final_earn_food_global_multiplier = calculateFinalStat(1, allModifiers.filter(mod => mod.target === "earn_food_global_multiplier"));
    const final_earn_food_herbi_multiplier = calculateFinalStat(1, allModifiers.filter(mod => mod.target === "earn_food_herbi_multiplier"));
    const final_earn_food_carni_multiplier = calculateFinalStat(1, allModifiers.filter(mod => mod.target === "earn_food_carni_multiplier"));
    const final_earn_experience_multiplier = calculateFinalStat(1, allModifiers.filter(mod => mod.target === "earn_experience_multiplier"));
    const final_earn_skill_point_multiplier = calculateFinalStat(1, allModifiers.filter(mod => mod.target === "earn_skill_point_multiplier"));
    const final_earn_money_multiplier = calculateFinalStat(1, allModifiers.filter(mod => mod.target === "earn_money_multiplier"));
    const final_earn_karma_multiplier = calculateFinalStat(1, allModifiers.filter(mod => mod.target === "earn_karma_multiplier"));

    const frontendDino: FrontendDinosaurDTO = {
      id: dbDino.id,
      userId: dbDino.userId,
      name: dbDino.name,
      base_max_energy: dbDino.base_max_energy,
      energy_decay_per_second: dbDino.energy_decay_per_second,
      energy_recovery_per_second: dbDino.energy_recovery_per_second,
      base_max_food: dbDino.base_max_food,
      base_max_hunger: dbDino.base_max_hunger,
      hunger_increase_per_second: dbDino.hunger_increase_per_second,
      hunger_increase_per_second_when_recovery: dbDino.hunger_increase_per_second_when_recovery,
      karma_width: dbDino.karma_width,
      created_at: dbDino.created_at,
      last_reborn: dbDino.last_reborn,
      reborn_amount: dbDino.reborn_amount,
      last_update_by_time_service: dbDino.last_update_by_time_service,
      is_sleeping: dbDino.is_sleeping,
      is_dead: dbDino.is_dead,
      karma: dbDino.karma,
      experience: dbDino.experience,
      level: dbDino.level,
      money: dbDino.money,
      skill_points: dbDino.skill_points,
      epoch: dbDino.epoch,
      energy: dbDino.energy,
      food: dbDino.food,
      hunger: dbDino.hunger,
      type: dbDino.type,
      diet: dbDino.diet,
      stats_modifiers: [
        ...dbDino.type.statModifiers,
        ...dbDino.diet.statModifiers
      ],
      final_max_energy,
      final_max_food,
      final_max_hunger,
      final_energy_recovery,
      final_energy_decay,
      final_hunger_increase,
      final_hunger_increase_when_recovery,
      final_earn_food_global_multiplier,
      final_earn_food_herbi_multiplier,
      final_earn_food_carni_multiplier,
      final_earn_experience_multiplier,
      final_earn_skill_point_multiplier,
      final_earn_money_multiplier,
      final_earn_karma_multiplier
    };

    return frontendDino;
  }
}
