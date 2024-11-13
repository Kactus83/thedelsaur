import { Dinosaur } from '../models/dinosaur.interface';
import {
  MAX_FOOD,
  BASE_ENERGY,
  BASE_MAX_HUNGER,
} from '../../../common/config/constants';
import pool from '../../../common/database/db';
import { calculateFinalMultipliers, calculateMaxHungerMultiplier } from '../utils/dinosaurUtils';
import { DietType } from '../models/dinosaur-diet.type';
import { DinosaurType } from '../models/dinosaur-type.type';

/**
 * Service pour gérer les dinosaures.
 */
export class DinosaursService {
  /**
   * Récupère un dinosaure par son ID, incluant les multiplicateurs et niveau.
   * @param dinosaurId L'ID du dinosaure.
   * @returns Le dinosaure ou null s'il n'est pas trouvé.
   */
  public async getDinosaurById(dinosaurId: number): Promise<Dinosaur | null> {
    try {
      // Requête pour joindre les tables dinosaur et dinosaur_multiplier
      const [results] = await pool.query(
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

      const dinosaurs = results as any[];
      if (dinosaurs.length === 0) return null;

      // Reconstitution de l'objet Dinosaur avec ses multiplicateurs
      const dinosaurData = dinosaurs[0];
      const dietType = dinosaurData.diet as DietType;
      const dinoType = dinosaurData.type as DinosaurType;
      const level = dinosaurData.level as number;

      // Calculer les multiplicateurs finaux en fonction du régime alimentaire, du type et du niveau
      const finalMultipliers = calculateFinalMultipliers(dietType, dinoType, level);
      const maxHungerMultiplier = calculateMaxHungerMultiplier(level);

      // Calculer et arrondir les valeurs de max_food et max_energy
      const dinosaur: Dinosaur = {
        ...dinosaurData,
        max_food: Math.round(MAX_FOOD * finalMultipliers.max_food_multiplier),
        max_energy: Math.round(BASE_ENERGY * finalMultipliers.max_energy_multiplier),
        max_hunger: Math.round(BASE_MAX_HUNGER * maxHungerMultiplier),
        multipliers: finalMultipliers,
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
      // Requête pour joindre les tables dinosaur et dinosaur_multiplier
      const [results] = await pool.query(
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

      const dinosaurs = results as any[];
      if (dinosaurs.length === 0) return null;

      // Reconstitution de l'objet Dinosaur avec ses multiplicateurs
      const dinosaurData = dinosaurs[0];
      const dietType = dinosaurData.diet as DietType;
      const dinoType = dinosaurData.type as DinosaurType;
      const level = dinosaurData.level as number;

      // Calculer les multiplicateurs finaux en fonction du régime alimentaire, du type et du niveau
      const finalMultipliers = calculateFinalMultipliers(dietType, dinoType, level);
      const maxHungerMultiplier = calculateMaxHungerMultiplier(level);

      // Calculer et arrondir les valeurs de max_food et max_energy
      const dinosaur: Dinosaur = {
        ...dinosaurData,
        max_food: Math.round(MAX_FOOD * finalMultipliers.max_food_multiplier),
        max_energy: Math.round(BASE_ENERGY * finalMultipliers.max_energy_multiplier),
        max_hunger: Math.round(BASE_MAX_HUNGER * maxHungerMultiplier),
        multipliers: finalMultipliers,
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

      // Utiliser les multiplicateurs actuels si les nouveaux ne sont pas fournis
      const multipliers = updates.multipliers || currentDinosaur.multipliers;
      const level = updates.level || currentDinosaur.level;

      // Recalculer et arrondir max_food et max_energy en utilisant les multiplicateurs finaux
      updates.max_food = Math.round(MAX_FOOD * multipliers.max_food_multiplier);
      updates.max_energy = Math.round(BASE_ENERGY * multipliers.max_energy_multiplier);
      updates.max_hunger = Math.round(BASE_MAX_HUNGER * calculateMaxHungerMultiplier(level));

      // Préparer la mise à jour en base de données
      const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
      const values = Object.values(updates);
      const query = `UPDATE dinosaur SET ${fields} WHERE id = ?`;
      values.push(dinosaurId);

      const [result] = await pool.query(query, values);
      const res = result as any;
      return res.affectedRows > 0;
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
}
