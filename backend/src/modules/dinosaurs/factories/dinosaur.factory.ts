// src/modules/dinosaurs/factories/dinosaur.factory.ts

import {
  INITIAL_ENERGY,
  INITIAL_FOOD,
  INITIAL_HUNGER,
} from '../../../common/config/constants';
import { DINOSAUR_CONSTANTS } from '../../../common/config/dinosaur.constants';
import { DatabaseDinosaur } from '../models/database-dinosaur.interface';
import { DinosaurType } from '../models/dinosaur-type.interface';
import { DinosaurDiet } from '../models/dinosaur-diet.interface';
import { Epoch } from '../models/epoch.enum';
import { DinosaurRepository } from '../repositories/dinosaur.repository';
import { FrontendDinosaurDTO } from '../models/frontend-dinosaur.dto';
import { DinosaurEvent } from '../models/dinosaur-event.interface';

/**
 * Extrait la valeur d'un modificateur ciblant une propriété donnée.
 * @param modifiers Tableau de modificateurs.
 * @param target La propriété ciblée (ex: "base_max_energy").
 * @returns La valeur trouvée ou 0.
 */
const getModifierValue = (
  modifiers: { target: string; type: string; value: number; source: string }[],
  target: string
): number => {
  const mod = modifiers.find(m => m.target === target);
  return mod ? mod.value : 0;
};

/**
 * Retourne un nom de dinosaure aléatoire.
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
 * Factory pour créer un nouveau dinosaure (DatabaseDinosaur).
 * 
 * Processus en 3 étapes :
 * 1. Récupérer la liste complète des types et diètes via le repository.
 * 2. Sélectionner aléatoirement un type et une diète.
 * 3. Combiner les constantes (dans DINOSAUR_CONSTANTS) avec les modificateurs du type
 *    pour déterminer les valeurs de référence.
 * 
 * @param userId L'ID de l'utilisateur auquel le dinosaure appartient.
 * @returns Un objet DatabaseDinosaur prêt à être inséré en base.
 */
export class DinosaurFactory {
  public static async createDinosaur(userId: number): Promise<DatabaseDinosaur> {
    const dinosaurRepo = new DinosaurRepository();
    const allTypes: DinosaurType[] = await dinosaurRepo.getAllDinosaurTypes();
    const allDiets: DinosaurDiet[] = await dinosaurRepo.getAllDinosaurDiets();

    // Sélection aléatoire
    const type: DinosaurType = allTypes[Math.floor(Math.random() * allTypes.length)];
    const diet: DinosaurDiet = allDiets[Math.floor(Math.random() * allDiets.length)];
    const name = generateRandomName();

    // Valeurs initiales (courantes)
    const energy = INITIAL_ENERGY;
    const food = INITIAL_FOOD;
    const hunger = INITIAL_HUNGER;

    // Valeurs de référence pour les max (constantes + modificateurs du type)
    const base_max_energy = DINOSAUR_CONSTANTS.BASE_MAX_ENERGY + getModifierValue(type.statModifiers, 'base_max_energy');
    const base_max_food = DINOSAUR_CONSTANTS.BASE_MAX_FOOD + getModifierValue(type.statModifiers, 'base_max_food');
    const base_max_hunger = DINOSAUR_CONSTANTS.BASE_MAX_HUNGER + getModifierValue(type.statModifiers, 'base_max_hunger');

    // Construction de l'objet DatabaseDinosaur
    const dinosaur: DatabaseDinosaur = {
      id: 0, // Généré en base lors de l'insertion
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
      karma_width: DINOSAUR_CONSTANTS.KARMA_WIDTH, 
      created_at: new Date(),
      last_reborn: new Date(),
      reborn_amount: 0,
      last_update_by_time_service: new Date(),
      is_sleeping: false,
      is_dead: false,
    };

    return dinosaur;
  }

  /**
   * Ressuscite un dinosaure en appliquant les changements d'un événement.
   * Pour la résurrection, on change le type selon l'événement et on génère une diète aléatoire.
   * 
   * @param dinosaur Le dinosaure (FrontendDinosaurDTO) à ressusciter.
   * @param event L'événement de résurrection.
   * @returns Le dinosaure ressuscité sous forme de FrontendDinosaurDTO.
   */
  public static async resurrectDinosaur(
    dinosaur: FrontendDinosaurDTO,
    event: DinosaurEvent
  ): Promise<FrontendDinosaurDTO> {
    const dinosaurRepo = new DinosaurRepository();
    // Si l'événement n'indique pas de type, on garde le type actuel ; sinon, on l'applique.
    const newType: DinosaurType = event.typeChange ?? dinosaur.type;
    // Générer une nouvelle diète au hasard :
    const allDiets = await dinosaurRepo.getAllDinosaurDiets();
    const newDiet: DinosaurDiet = allDiets[Math.floor(Math.random() * allDiets.length)];

    // Reconstruire un objet DatabaseDinosaur à partir du DTO existant et des nouvelles données
    const resurrectedDatabaseDino: DatabaseDinosaur = {
      id: dinosaur.id,
      name: generateRandomName(), // Nouveau nom
      userId: dinosaur.userId,
      type: newType,
      diet: newDiet,
      energy: event.energyChange,
      food: event.foodChange,
      hunger: event.hungerChange,
      karma: Math.max(-dinosaur.karma_width, Math.min(dinosaur.karma + event.karmaChange, dinosaur.karma_width)),
      experience: 0,
      level: 1,
      money: dinosaur.money,
      skill_points: dinosaur.skill_points,
      epoch: Epoch.Ancient_Epoch1,
      // Recalcul des valeurs de référence à partir du nouveau type
      base_max_energy: DINOSAUR_CONSTANTS.BASE_MAX_ENERGY + getModifierValue(newType.statModifiers, 'base_max_energy'),
      energy_decay_per_second: dinosaur.energy_decay_per_second,
      energy_recovery_per_second: dinosaur.energy_recovery_per_second,
      base_max_food: DINOSAUR_CONSTANTS.BASE_MAX_FOOD + getModifierValue(newType.statModifiers, 'base_max_food'),
      base_max_hunger: DINOSAUR_CONSTANTS.BASE_MAX_HUNGER + getModifierValue(newType.statModifiers, 'base_max_hunger'),
      hunger_increase_per_second: dinosaur.hunger_increase_per_second,
      karma_width: dinosaur.karma_width,
      created_at: dinosaur.created_at,
      last_reborn: new Date(),
      reborn_amount: dinosaur.reborn_amount + 1,
      last_update_by_time_service: new Date(),
      is_sleeping: false,
      is_dead: false,
    };

    return DinosaurFactory.convertToFrontendDinosaur(resurrectedDatabaseDino);
  }

  /**
   * Convertit un DatabaseDinosaur en un objet FrontendDinosaurDTO.
   * Cette méthode applique un multiplicateur de niveau pour calculer les valeurs finales.
   * La logique de calcul pourra être améliorée ultérieurement via un service dédié.
   * 
   * @param dbDino Le dinosaure tel qu'enregistré en base.
   * @returns Un objet FrontendDinosaurDTO.
   */
  public static convertToFrontendDinosaur(dbDino: DatabaseDinosaur): FrontendDinosaurDTO {
    // Multiplicateur de niveau (exemple : +5% par niveau au-delà de 1)
    const levelMultiplier = 1 + (dbDino.level - 1) * 0.05;

    // Calcul des valeurs finales
    const final_max_energy = dbDino.base_max_energy * levelMultiplier;
    const final_max_food = dbDino.base_max_food * levelMultiplier;
    const final_max_hunger = dbDino.base_max_hunger * levelMultiplier;
    const final_energy_recovery = dbDino.energy_recovery_per_second * levelMultiplier;
    const final_energy_decay = dbDino.energy_decay_per_second * levelMultiplier;
    const final_hunger_increase = dbDino.hunger_increase_per_second * levelMultiplier;

    // Regrouper les modificateurs issus du type et de la diète
    const stats_modifiers = [
      ...dbDino.type.statModifiers,
      ...dbDino.diet.statModifiers
      // On pourra ajouter d'autres modificateurs dynamiques (niveau, karma, etc.)
    ];

    // Construction du DTO Frontend
    const frontendDino: FrontendDinosaurDTO = {
      id: dbDino.id,
      userId: dbDino.userId,
      name: dbDino.name,
      // Valeurs de base
      base_max_energy: dbDino.base_max_energy,
      energy_decay_per_second: dbDino.energy_decay_per_second,
      energy_recovery_per_second: dbDino.energy_recovery_per_second,
      base_max_food: dbDino.base_max_food,
      base_max_hunger: dbDino.base_max_hunger,
      hunger_increase_per_second: dbDino.hunger_increase_per_second,
      karma_width: dbDino.karma_width, 
      // Détails techniques
      created_at: dbDino.created_at,
      last_reborn: dbDino.last_reborn,
      reborn_amount: dbDino.reborn_amount,
      last_update_by_time_service: dbDino.last_update_by_time_service,
      is_sleeping: dbDino.is_sleeping,
      is_dead: dbDino.is_dead,
      // Valeurs courantes
      karma: dbDino.karma,
      experience: dbDino.experience,
      level: dbDino.level,
      money: dbDino.money,
      skill_points: dbDino.skill_points,
      epoch: dbDino.epoch,
      energy: dbDino.energy,
      food: dbDino.food,
      hunger: dbDino.hunger,
      // Génétique
      type: dbDino.type,
      diet: dbDino.diet,
      // Modificateurs additionnels
      stats_modifiers,
      // Multiplicateurs finaux calculés
      final_max_energy,
      final_max_food,
      final_max_hunger,
      final_energy_recovery,
      final_energy_decay,
      final_hunger_increase,
      final_earn_food_global_multiplier: 1, 
      final_earn_food_herbi_multiplier: 1,
      final_earn_food_carni_multiplier: 1,
      final_earn_experience_multiplier: 1,
      final_earn_skill_point_multiplier: 1,
      final_earn_money_multiplier: 1,
      final_earn_karma_multiplier: 1
    };

    return frontendDino;
  }
}
