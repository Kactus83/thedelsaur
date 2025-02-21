import { DINOSAUR_CONSTANTS } from '../../../common/config/dinosaur.constants';
import { DatabaseDinosaur } from '../models/database-dinosaur.interface';
import { DinosaurType } from '../models/dinosaur-type.interface';
import { DinosaurDiet } from '../models/dinosaur-diet.interface';
import { Epoch } from '../models/epoch.enum';
import { DinosaurRepository } from '../repositories/dinosaur.repository';
import { FrontendDinosaurDTO } from '../models/frontend-dinosaur.dto';
import { StatModifier } from '../models/stats-modifiers.types';
import { getLevelModifiers } from '../utils/levelModifiers';
import { DinosaurGameAssetsRepository } from '../repositories/dinosaur-game-assets.repository';

/**
 * Factory pour créer ou ressusciter un dinosaure.
 * Construite avec une instance de DinosaurRepository afin d'éviter les instanciations multiples.
 */
export class DinosaurFactory {
  private dinosaurRepo: DinosaurRepository;

  constructor(dinosaurRepo: DinosaurRepository) {
    this.dinosaurRepo = dinosaurRepo;
  }

  public async createDinosaur(userId: number): Promise<DatabaseDinosaur> {
    const allTypes: DinosaurType[] = await this.dinosaurRepo.getAllDinosaurTypes();
    const allDiets: DinosaurDiet[] = await this.dinosaurRepo.getAllDinosaurDiets();

    const type: DinosaurType = allTypes[Math.floor(Math.random() * allTypes.length)];
    const diet: DinosaurDiet = allDiets[Math.floor(Math.random() * allDiets.length)];
    const name = generateRandomName();

    const dinosaur: DatabaseDinosaur = {
      id: 0, // sera généré en base lors de l'insertion
      name,
      userId,
      type,
      diet,
      energy: DINOSAUR_CONSTANTS.INITIAL_ENERGY,
      food: DINOSAUR_CONSTANTS.INITIAL_FOOD,
      hunger: DINOSAUR_CONSTANTS.INITIAL_HUNGER,
      karma: 0,
      experience: 10000,    // ATTENTION TEMMPORAIRE POUR DEBUGING
      level: 1,
      money: 5000,          // ATTENTION TEMMPORAIRE POUR DEBUGING
      skill_points: 5000,   // ATTENTION TEMMPORAIRE POUR DEBUGING
      epoch: Epoch.Ancient_Epoch1,
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

  public async resurrectDinosaur(dinoDto: FrontendDinosaurDTO): Promise<FrontendDinosaurDTO> {
    const allTypes = await this.dinosaurRepo.getAllDinosaurTypes();
    const newType = allTypes[Math.floor(Math.random() * allTypes.length)];
    const allDiets = await this.dinosaurRepo.getAllDinosaurDiets();
    const newDiet = allDiets[Math.floor(Math.random() * allDiets.length)];

    const resurrectedDino: DatabaseDinosaur = {
      id: dinoDto.id,
      name: generateRandomName(),
      userId: dinoDto.userId,
      type: newType,
      diet: newDiet,
      energy: DINOSAUR_CONSTANTS.INITIAL_ENERGY,
      food: DINOSAUR_CONSTANTS.INITIAL_FOOD,
      hunger: DINOSAUR_CONSTANTS.INITIAL_HUNGER,
      karma: dinoDto.karma + DINOSAUR_CONSTANTS.KARMA_GAIN_AFTER_DEATH,
      experience: 0,
      level: 1,
      money: 0,
      skill_points: 0,
      epoch: Epoch.Ancient_Epoch1,
      created_at: dinoDto.created_at,
      last_reborn: new Date(),
      reborn_amount: dinoDto.reborn_amount + 1,
      last_update_by_time_service: new Date(),
      is_sleeping: false,
      is_dead: false,
      skills: [],
      items: [],
      buildings: []
    };

    return this.convertToFrontendDinosaur(resurrectedDino);
  }

  public convertToFrontendDinosaur(dbDino: DatabaseDinosaur): FrontendDinosaurDTO {
    // Calcul des valeurs de base via les constantes et modificateurs du type
    const base_max_energy = DINOSAUR_CONSTANTS.BASE_MAX_ENERGY + getModifierValue(dbDino.type.statModifiers, 'base_max_energy');
    const base_max_food = DINOSAUR_CONSTANTS.BASE_MAX_FOOD + getModifierValue(dbDino.type.statModifiers, 'base_max_food');
    const base_max_hunger = DINOSAUR_CONSTANTS.BASE_MAX_HUNGER + getModifierValue(dbDino.type.statModifiers, 'base_max_hunger');

    const levelModifiers = getLevelModifiers(dbDino.level);
    let allModifiers: StatModifier[] = [
      ...dbDino.type.statModifiers,
      ...dbDino.diet.statModifiers,
      ...levelModifiers
    ];

    if (dbDino.skills && dbDino.skills.length > 0) {
      dbDino.skills.forEach(skill => {
        if (skill.isPurchased) {
          allModifiers = allModifiers.concat(skill.statModifiers);
        }
      });
    }

    if (dbDino.items && dbDino.items.length > 0) {
      dbDino.items.forEach(item => {
        if (item.itemType === 'persistent' && item.levels && item.levels.length > 0) {
          const levelDef = item.levels.find(lvl => lvl.level === item.currentLevelOrQuantity);
          if (levelDef) {
            allModifiers = allModifiers.concat(levelDef.statModifiers);
          }
        }
      });
    }

    if (dbDino.buildings && dbDino.buildings.length > 0) {
      dbDino.buildings.forEach(building => {
        allModifiers = allModifiers.concat(building.statModifiers);
      });
    }

    const final_max_energy = calculateFinalStat(base_max_energy, allModifiers.filter(mod => mod.target === "base_max_energy"));
    const final_max_food = calculateFinalStat(base_max_food, allModifiers.filter(mod => mod.target === "base_max_food"));
    const final_max_hunger = calculateFinalStat(base_max_hunger, allModifiers.filter(mod => mod.target === "base_max_hunger"));
    const final_energy_recovery = calculateFinalStat(DINOSAUR_CONSTANTS.ENERGY_RECOVERY_PER_SECOND, allModifiers.filter(mod => mod.target === "energy_recovery_multiplier"));
    const final_energy_decay = calculateFinalStat(DINOSAUR_CONSTANTS.ENERGY_DECAY_PER_SECOND, allModifiers.filter(mod => mod.target === "energy_decay_multiplier"));
    const final_hunger_increase = calculateFinalStat(DINOSAUR_CONSTANTS.HUNGER_INCREASE_PER_SECOND, allModifiers.filter(mod => mod.target === "hunger_increase_multiplier"));
    const final_hunger_increase_when_recovery = calculateFinalStat(DINOSAUR_CONSTANTS.HUNGER_INCREASE_PER_SECOND_WHEN_RECOVERY, allModifiers.filter(mod => mod.target === "hunger_increase_multiplier"));

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
      base_max_energy,
      energy_decay_per_second: DINOSAUR_CONSTANTS.ENERGY_DECAY_PER_SECOND,
      energy_recovery_per_second: DINOSAUR_CONSTANTS.ENERGY_RECOVERY_PER_SECOND,
      base_max_food,
      base_max_hunger,
      hunger_increase_per_second: DINOSAUR_CONSTANTS.HUNGER_INCREASE_PER_SECOND,
      hunger_increase_per_second_when_recovery: DINOSAUR_CONSTANTS.HUNGER_INCREASE_PER_SECOND_WHEN_RECOVERY,
      karma_width: DINOSAUR_CONSTANTS.KARMA_WIDTH,
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
      final_earn_karma_multiplier,
      skills: dbDino.skills,
      items: dbDino.items,
      buildings: dbDino.buildings
    };

    return frontendDino;
  }
}

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

const getModifierValue = (
  modifiers: StatModifier[],
  target: string
): number => {
  const mod = modifiers.find(m => m.target === target);
  return mod ? mod.value : 0;
};
