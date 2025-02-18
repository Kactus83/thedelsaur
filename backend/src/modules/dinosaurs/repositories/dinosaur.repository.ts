import { Dinosaur } from '../models/backend-dinosaur.interface';
import pool from '../../../common/database/db';
import { calculateMaxHungerMultiplier } from '../utils/dinosaurUtils';
import {
  MAX_FOOD,
  BASE_ENERGY,
  BASE_MAX_HUNGER,
  LEVEL_MULTIPLIER_FOR_MAX_VALUES,
} from '../../../common/config/constants';

import { RowDataPacket } from 'mysql2';
import { DietType } from '../models/dinosaur-diet.interface';
import { DinosaurType } from '../models/dinosaur-type.interface';
import { DinosaurMultiplier } from '../models/dinosaur-multiplier.interface';
import { Epoch } from '../models/epoch.enum';

/**
 * Dépôt pour gérer les opérations de base de données liées aux dinosaures.
 */
export class DinosaurRepository {
  /**
   * Récupère un dinosaure par son ID, incluant les multiplicateurs et niveau.
   * @param dinosaurId L'ID du dinosaure.
   * @returns Le dinosaure ou null s'il n'est pas trouvé.
   */
  public async getDinosaurById(dinosaurId: number): Promise<Dinosaur | null> {
    try {
      const [results] = await pool.query<DinosaurDataRow[]>(
        `SELECT d.*, 
                dm.earn_herbi_food_multiplier, 
                dm.earn_carni_food_multiplier, 
                dm.earn_food_multiplier, 
                dm.earn_energy_multiplier, 
                dm.earn_experience_multiplier, 
                dm.max_energy_multiplier, 
                dm.max_food_multiplier
        FROM dinosaur d
        LEFT JOIN dinosaur_multiplier dm ON d.id = dm.dinosaur_id
        WHERE d.id = ?`,
        [dinosaurId]
      );

      if (results.length === 0) return null;

      const dinosaurData = results[0];

      // Extract the multipliers, using default values if null
      const multipliers: DinosaurMultiplier = {
        earn_herbi_food_multiplier: dinosaurData.earn_herbi_food_multiplier ?? 1,
        earn_carni_food_multiplier: dinosaurData.earn_carni_food_multiplier ?? 1,
        earn_food_multiplier: dinosaurData.earn_food_multiplier ?? 1,
        earn_energy_multiplier: dinosaurData.earn_energy_multiplier ?? 1,
        earn_experience_multiplier: dinosaurData.earn_experience_multiplier ?? 1,
        max_energy_multiplier: dinosaurData.max_energy_multiplier ?? 1,
        max_food_multiplier: dinosaurData.max_food_multiplier ?? 1,
      };

      const level = dinosaurData.level;

      const maxHungerMultiplier = calculateMaxHungerMultiplier(level);

      // Calculate max_food, max_energy, max_hunger
      const max_food = Math.round(
        MAX_FOOD * multipliers.max_food_multiplier * (1 + ((level / 100) * LEVEL_MULTIPLIER_FOR_MAX_VALUES))
      );
      const max_energy = Math.round(
        BASE_ENERGY * multipliers.max_energy_multiplier * (1 + ((level / 100) * LEVEL_MULTIPLIER_FOR_MAX_VALUES))
      );
      const max_hunger = Math.round(
        BASE_MAX_HUNGER * maxHungerMultiplier * (1 + ((level / 100) * LEVEL_MULTIPLIER_FOR_MAX_VALUES))
      );

      // Construct the Dinosaur object
      const dinosaur: Dinosaur = {
        id: dinosaurData.id,
        name: dinosaurData.name,
        diet: dinosaurData.diet as DietType,
        type: dinosaurData.type as DinosaurType,
        energy: dinosaurData.energy,
        max_energy: max_energy,
        food: dinosaurData.food,
        max_food: max_food,
        hunger: dinosaurData.hunger,
        max_hunger: max_hunger,
        experience: dinosaurData.experience,
        level: level,
        epoch: dinosaurData.epoch, 
        created_at: dinosaurData.created_at,
        last_reborn: dinosaurData.last_reborn,
        karma: dinosaurData.karma,
        last_update_by_time_service: dinosaurData.last_update_by_time_service,
        reborn_amount: dinosaurData.reborn_amount,
        isSleeping: dinosaurData.isSleeping,
        isDead: dinosaurData.isDead,
        user_id: dinosaurData.user_id,
        multipliers: multipliers,
      };

      return dinosaur;
    } catch (err) {
      console.error('Erreur lors de la récupération du dinosaure avec multiplicateurs:', err);
      throw err;
    }
  }

  /**
   * Récupère le dinosaure associé à un utilisateur, incluant les multiplicateurs et niveau.
   * @param userId L'ID de l'utilisateur.
   * @returns Le dinosaure ou null s'il n'est pas trouvé.
   */
  public async getDinosaurByUserId(userId: number): Promise<Dinosaur | null> {
    try {
      const [results] = await pool.query<DinosaurDataRow[]>(
        `SELECT d.*, 
                dm.earn_herbi_food_multiplier, 
                dm.earn_carni_food_multiplier, 
                dm.earn_food_multiplier, 
                dm.earn_energy_multiplier, 
                dm.earn_experience_multiplier, 
                dm.max_energy_multiplier, 
                dm.max_food_multiplier
         FROM dinosaur d
         LEFT JOIN dinosaur_multiplier dm ON d.id = dm.dinosaur_id
         WHERE d.user_id = ?`,
        [userId]
      );

      if (results.length === 0) return null;

      const dinosaurData = results[0];

      // Extract the multipliers, using default values if null
      const multipliers: DinosaurMultiplier = {
        earn_herbi_food_multiplier: dinosaurData.earn_herbi_food_multiplier ?? 1,
        earn_carni_food_multiplier: dinosaurData.earn_carni_food_multiplier ?? 1,
        earn_food_multiplier: dinosaurData.earn_food_multiplier ?? 1,
        earn_energy_multiplier: dinosaurData.earn_energy_multiplier ?? 1,
        earn_experience_multiplier: dinosaurData.earn_experience_multiplier ?? 1,
        max_energy_multiplier: dinosaurData.max_energy_multiplier ?? 1,
        max_food_multiplier: dinosaurData.max_food_multiplier ?? 1,
      };

      const level = dinosaurData.level;

      const maxHungerMultiplier = calculateMaxHungerMultiplier(level);

      // Calculate max_food, max_energy, max_hunger
      const max_food = Math.round(
        MAX_FOOD * multipliers.max_food_multiplier * (1 + ((level / 100) * LEVEL_MULTIPLIER_FOR_MAX_VALUES))
      );
      const max_energy = Math.round(
        BASE_ENERGY * multipliers.max_energy_multiplier * (1 + ((level / 100) * LEVEL_MULTIPLIER_FOR_MAX_VALUES))
      );
      const max_hunger = Math.round(
        BASE_MAX_HUNGER * maxHungerMultiplier * (1 + ((level / 100) * LEVEL_MULTIPLIER_FOR_MAX_VALUES))
      );

      // Construct the Dinosaur object
      const dinosaur: Dinosaur = {
        id: dinosaurData.id,
        name: dinosaurData.name,
        diet: dinosaurData.diet as DietType,
        type: dinosaurData.type as DinosaurType,
        energy: dinosaurData.energy,
        max_energy: max_energy,
        food: dinosaurData.food,
        max_food: max_food,
        hunger: dinosaurData.hunger,
        max_hunger: max_hunger,
        experience: dinosaurData.experience,
        level: level,
        epoch: dinosaurData.epoch, 
        created_at: dinosaurData.created_at,
        last_reborn: dinosaurData.last_reborn,
        karma: dinosaurData.karma,
        last_update_by_time_service: dinosaurData.last_update_by_time_service,
        reborn_amount: dinosaurData.reborn_amount,
        isSleeping: dinosaurData.isSleeping,
        isDead: dinosaurData.isDead,
        user_id: dinosaurData.user_id,
        multipliers: multipliers,
      };

      return dinosaur;
    } catch (err) {
      console.error('Erreur lors de la récupération du dinosaure avec multiplicateurs:', err);
      throw err;
    }
  }

  /**
   * Met à jour un dinosaure.
   * @param dinosaurId L'ID du dinosaure.
   * @param updates Les mises à jour à appliquer.
   * @returns true si la mise à jour a réussi, false sinon.
   */
  public async updateDinosaur(dinosaurId: number, updates: Partial<Dinosaur>): Promise<boolean> {
    try {
      // Récupérer le dinosaure actuel pour obtenir les multiplicateurs existants si nécessaires
      const currentDinosaur = await this.getDinosaurById(dinosaurId);
      if (!currentDinosaur) {
        throw new Error('Dinosaure introuvable');
      }

      const level = updates.level || currentDinosaur.level;

      // Recalculate and round max_food, max_energy, max_hunger if necessary
      if (updates.multipliers || updates.level) {
        const multipliers = updates.multipliers || currentDinosaur.multipliers;
        updates.max_food = Math.round(
          MAX_FOOD * multipliers.max_food_multiplier * (1 + ((level / 100) * LEVEL_MULTIPLIER_FOR_MAX_VALUES))
        );
        updates.max_energy = Math.round(
          BASE_ENERGY * multipliers.max_energy_multiplier * (1 + ((level / 100) * LEVEL_MULTIPLIER_FOR_MAX_VALUES))
        );
        const maxHungerMultiplier = calculateMaxHungerMultiplier(level);
        updates.max_hunger = Math.round(
          BASE_MAX_HUNGER * maxHungerMultiplier * (1 + ((level / 100) * LEVEL_MULTIPLIER_FOR_MAX_VALUES))
        );
      }

      // Update dinosaur data
      const updatedDinosaur = await this.updateDinosaurData(dinosaurId, updates);

      // Update multipliers if necessary
      let updatedMultipliers = true;
      if (updates.multipliers) {
        updatedMultipliers = await this.updateDinosaurMultipliers(dinosaurId, updates.multipliers);
      }

      return updatedDinosaur && updatedMultipliers;
    } catch (err) {
      console.error('Erreur lors de la mise à jour du dinosaure:', err);
      throw err;
    }
  }

  /**
   * Met à jour le nom d'un dinosaure par l'ID utilisateur.
   * @param userId L'ID de l'utilisateur.
   * @param newName Le nouveau nom du dinosaure.
   * @returns true si la mise à jour a réussi, false sinon.
   */
  public async updateDinosaurName(userId: number, newName: string): Promise<boolean> {
    try {
      const query = `UPDATE dinosaur SET name = ? WHERE user_id = ?`;
      const [result] = await pool.query(query, [newName, userId]);
      const res = result as any;
      return res.affectedRows > 0;
    } catch (err) {
      console.error('Erreur lors de la mise à jour du nom du dinosaure:', err);
      throw err;
    }
  }

  // Private methods for SRP

  private async updateDinosaurData(dinosaurId: number, updates: Partial<Dinosaur>): Promise<boolean> {
    try {
      const dinosaurFields = Object.keys(updates)
        .filter((key) => key !== 'multipliers')
        .map((key) => `${key} = ?`)
        .join(', ');
      const dinosaurValues = Object.entries(updates)
        .filter(([key]) => key !== 'multipliers')
        .map(([, value]) => value);
      const query = `UPDATE dinosaur SET ${dinosaurFields} WHERE id = ?`;
      dinosaurValues.push(dinosaurId);
      const [dinosaurResult] = await pool.query(query, dinosaurValues);
      const dinosaurRes = dinosaurResult as any;
      return dinosaurRes.affectedRows > 0;
    } catch (err) {
      console.error('Erreur lors de la mise à jour du dinosaure:', err);
      throw err;
    }
  }

  private async updateDinosaurMultipliers(dinosaurId: number, multipliers: Partial<DinosaurMultiplier>): Promise<boolean> {
    try {
      const multiplierFields = Object.keys(multipliers)
        .map((key) => `${key} = ?`)
        .join(', ');
      const multiplierValues = Object.values(multipliers);
      const query = `UPDATE dinosaur_multiplier SET ${multiplierFields} WHERE dinosaur_id = ?`;
      multiplierValues.push(dinosaurId);
      const [multiplierResult] = await pool.query(query, multiplierValues);
      const multiplierRes = multiplierResult as any;
      return multiplierRes.affectedRows > 0;
    } catch (err) {
      console.error('Erreur lors de la mise à jour des multiplicateurs du dinosaure:', err);
      throw err;
    }
  }
}

// DinosaurDataRow interface (correspond au retour brut depuis la abse de donnée)
interface DinosaurDataRow extends RowDataPacket {
  // Dinosaur fields
  id: number;
  name: string;
  diet: DietType;
  type: DinosaurType;
  energy: number;
  food: number;
  hunger: number;
  experience: number;
  level: number;
  epoch: Epoch;
  created_at: Date;
  last_reborn: string;
  karma: number;
  last_update_by_time_service: string;
  reborn_amount: number;
  isSleeping: boolean;
  isDead: boolean;
  user_id: number;

  // Multiplier fields (may be null if no record in 'dinosaur_multiplier')
  earn_herbi_food_multiplier: number | null;
  earn_carni_food_multiplier: number | null;
  earn_food_multiplier: number | null;
  earn_energy_multiplier: number | null;
  earn_experience_multiplier: number | null;
  max_energy_multiplier: number | null;
  max_food_multiplier: number | null;
}
