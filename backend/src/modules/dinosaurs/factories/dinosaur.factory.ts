import { BASE_ENERGY, BASE_FOOD, BASE_MAX_HUNGER, MAX_ENERGY, MAX_FOOD } from '../../../common/config/constants';
import { DietTypeMultipliers } from '../libs/multipliers/dinosaur-diet-multipliers';
import { DinosaurTypeMultipliers } from '../libs/multipliers/dinosaur-type-multipliers';
import { DietType } from '../models/dinosaur-diet.type';
import { DinosaurType } from '../models/dinosaur-type.type';
import { Dinosaur } from '../models/dinosaur.interface';
import { DinosaurMultiplier } from '../models/dinosaur-multiplier.interface';
import { DinosaurDTO } from '../models/dinosaur.dto';
import { validateOrReject, plainToInstance } from 'class-validator';

// Liste de prénoms possibles pour les dinosaures
const names: string[] = [
  'Rex', 'Bella', 'Spike', 'Tina', 'Dino', 'Luna',
  'Thor', 'Milo', 'Zara', 'Rocky', 'Sasha', 'Leo',
  'Nina', 'Gus', 'Ruby', 'Max', 'Maya', 'Oscar',
  'Charlie', 'Lily', 'Buddy', 'Molly', 'Jack', 'Daisy',
  'Toby', 'Sadie', 'Buster', 'Chloe', 'Bear', 'Coco',
  'Duke', 'Penny', 'Murphy', 'Rosie', 'Zeus', 'Gracie',
  'Sam', 'Abby'
];

// Fonction pour générer un nom aléatoire
const generateRandomName = (): string => {
  const randomIndex = Math.floor(Math.random() * names.length);
  return names[randomIndex];
};

// Fonction pour obtenir un régime alimentaire aléatoire
const getRandomDiet = (): DietType => {
  const diets: DietType[] = [DietType.HERBIVORE, DietType.CARNIVORE, DietType.OMNIVORE];
  const randomIndex = Math.floor(Math.random() * diets.length);
  return diets[randomIndex];
};

// Fonction pour obtenir un type de dinosaure aléatoire
const getRandomType = (): DinosaurType => {
  const types: DinosaurType[] = [DinosaurType.LAND, DinosaurType.AIR, DinosaurType.SEA];
  const randomIndex = Math.floor(Math.random() * types.length);
  return types[randomIndex];
};

export class DinosaurFactory {
  /**
   * Crée un dinosaure avec des multiplicateurs basés sur son type et régime alimentaire.
   * @param userId ID de l'utilisateur auquel appartient le dinosaure.
   * @returns Un objet Dinosaur validé.
   */
  public static async createDinosaur(userId: number): Promise<Dinosaur> {
    const name = generateRandomName();
    const type = getRandomType();
    const diet = getRandomDiet();

    // Initialiser les statistiques de base
    const energy = BASE_ENERGY;
    const max_energy = MAX_ENERGY;
    const food = BASE_FOOD;
    const max_food = MAX_FOOD;
    const hunger = 0;
    const max_hunger = BASE_MAX_HUNGER;
    const experience = 0;
    const epoch = 'past';
    const reborn_amount = 0;
    const karma = 0;
    const level = 1;
    const isSleeping = false;
    const isDead = false;
    const created_at = new Date();
    const last_reborn = new Date().toISOString();
    const last_update_by_time_service = new Date().toISOString();

    // Obtenir les multiplicateurs de type
    const typeMultipliers = DinosaurTypeMultipliers[type];

    // Obtenir les multiplicateurs de régime alimentaire
    const dietMultipliers = DietTypeMultipliers[diet];

    // Combiner les multiplicateurs selon la logique spécifiée
    const finalMultipliers: DinosaurMultiplier = {
      earn_herbi_food_multiplier: (typeMultipliers.earn_herbi_food_multiplier || 1) +
        ((dietMultipliers.earn_herbi_food_multiplier || 1) - 1),
      earn_carni_food_multiplier: (typeMultipliers.earn_carni_food_multiplier || 1) +
        ((dietMultipliers.earn_carni_food_multiplier || 1) - 1),
      earn_food_multiplier: (typeMultipliers.earn_food_multiplier || 1) +
        ((dietMultipliers.earn_food_multiplier || 1) - 1),
      earn_energy_multiplier: (typeMultipliers.earn_energy_multiplier || 1) +
        ((dietMultipliers.earn_energy_multiplier || 1) - 1),
      earn_experience_multiplier: (typeMultipliers.earn_experience_multiplier || 1) +
        ((dietMultipliers.earn_experience_multiplier || 1) - 1),
      max_energy_multiplier: (typeMultipliers.max_energy_multiplier || 1) +
        ((dietMultipliers.max_energy_multiplier || 1) - 1),
      max_food_multiplier: (typeMultipliers.max_food_multiplier || 1) +
        ((dietMultipliers.max_food_multiplier || 1) - 1),
    };

    // Créer l'objet Dinosaur
    const dinosaur: Dinosaur = {
      id: 0, // Sera généré lors de l'insertion en base de données
      name,
      user_id: userId,
      diet,
      type,
      energy,
      max_energy: MAX_ENERGY * finalMultipliers.max_energy_multiplier,
      food,
      max_food: MAX_FOOD * finalMultipliers.max_food_multiplier,
      hunger,
      max_hunger,
      experience,
      level,
      epoch,
      created_at,
      last_reborn,
      reborn_amount,
      karma,
      last_update_by_time_service,
      isSleeping,
      isDead,
      multipliers: finalMultipliers,
    };

    // Valider l'objet Dinosaur avec le DTO
    const dinosaurDTO = plainToInstance(DinosaurDTO, dinosaur);
    await validateOrReject(dinosaurDTO).catch((errors: any) => {
      console.error('Validation échouée pour le dinosaure:', errors);
      throw new Error('Validation échouée pour le dinosaure');
    });

    return dinosaur;
  }
}