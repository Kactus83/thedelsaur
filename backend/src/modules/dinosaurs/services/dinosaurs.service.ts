import { BASE_ENERGY, BASE_FOOD, BASE_MAX_HUNGER, MAX_FOOD } from '../../../common/config/constants';
import pool from '../../../common/database/db';
import { Dinosaur } from '../models/dinosaur.interface';
import { DinosaurEvent } from '../models/dinosaur-event.interface';

/**
 * Applique les effets d'un événement au dinosaure, en modifiant ses statistiques en place.
 * @param dinosaur Dinosaure auquel appliquer les effets.
 * @param event Événement à appliquer avec ses modifications de stats.
 * @returns L'événement appliqué pour utilisation dans le contrôleur.
 */
export function applyEventToDinosaur(dinosaur: Dinosaur, event: DinosaurEvent): DinosaurEvent {
  dinosaur.food = Math.min(dinosaur.food + event.foodChange, dinosaur.max_food);
  dinosaur.energy = Math.max(dinosaur.energy + event.energyChange, 0);
  dinosaur.hunger = Math.max(dinosaur.hunger + event.hungerChange, 0);

  return event; // Renvoie l'événement appliqué pour permettre au contrôleur de l'inclure dans la réponse.
}

export class DinosaursService {
  // Récupérer un dinosaure par son ID, incluant les multiplicateurs
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
      const dinosaur: Dinosaur = {
        ...dinosaurData,
        multipliers: {
          earn_herbi_food_multiplier: dinosaurData.earn_herbi_food_multiplier,
          earn_carni_food_multiplier: dinosaurData.earn_carni_food_multiplier,
          earn_food_multiplier: dinosaurData.earn_food_multiplier,
          earn_energy_multiplier: dinosaurData.earn_energy_multiplier,
          earn_experience_multiplier: dinosaurData.earn_experience_multiplier,
          max_energy_multiplier: dinosaurData.max_energy_multiplier,
          max_food_multiplier: dinosaurData.max_food_multiplier,
        },
      };

      return dinosaur;
    } catch (err) {
      console.error('Erreur lors de la récupération du dinosaure avec multiplicateurs:', err);
      throw err;
    }
  }
  
  // Récupérer le dinosaure associé à un utilisateur, incluant les multiplicateurs
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
      const dinosaur: Dinosaur = {
        ...dinosaurData,
        multipliers: {
          earn_herbi_food_multiplier: dinosaurData.earn_herbi_food_multiplier,
          earn_carni_food_multiplier: dinosaurData.earn_carni_food_multiplier,
          earn_food_multiplier: dinosaurData.earn_food_multiplier,
          earn_energy_multiplier: dinosaurData.earn_energy_multiplier,
          earn_experience_multiplier: dinosaurData.earn_experience_multiplier,
          max_energy_multiplier: dinosaurData.max_energy_multiplier,
          max_food_multiplier: dinosaurData.max_food_multiplier,
        },
      };

      return dinosaur;
    } catch (err) {
      console.error('Erreur lors de la récupération du dinosaure avec multiplicateurs:', err);
      throw err;
    }
  }

  // Mettre à jour un dinosaure
  public async updateDinosaur(dinosaurId: number, updates: Partial<Dinosaur>): Promise<boolean> {
    try {
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

  // Créer un nouveau dinosaure
  public async createDinosaur(
    name: string,
    userId: number,
    diet: string,
    type: string,
    energy: number = BASE_ENERGY,
    max_energy: number = BASE_ENERGY,
    food: number = BASE_FOOD,
    max_food: number = MAX_FOOD,
    hunger: number = 0,
    max_hunger: number = BASE_MAX_HUNGER,
    experience: number = 0,
    epoch: string = 'past',
    reborn_amount: number = 0,
    karma: number = 0,
    isSleeping: boolean = false,
    isDead: boolean = false
  ): Promise<number> {
    try {
      const dinosaurQuery = `INSERT INTO dinosaur (name, user_id, diet, type, energy, max_energy, food, max_food, hunger, max_hunger, experience, epoch, reborn_amount, isSleeping, isDead, karma)
                             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const [dinosaurResult] = await pool.query(dinosaurQuery, [name, userId, diet, type, energy, max_energy, food, max_food, hunger, max_hunger, experience, epoch, reborn_amount, isSleeping, isDead, karma]);
      const dinosaurId = (dinosaurResult as any).insertId;

      // Initialisation des multiplicateurs pour le dinosaure créé
      const multiplierQuery = `INSERT INTO dinosaur_multiplier (dinosaur_id) VALUES (?)`;
      await pool.query(multiplierQuery, [dinosaurId]);

      return dinosaurId;
    } catch (err) {
      console.error('Erreur lors de la création du dinosaure:', err);
      throw err;
    }
  }

  // Supprimer un dinosaure par son ID
  public async deleteDinosaurById(dinosaurId: number): Promise<boolean> {
    try {
      const query = 'DELETE FROM dinosaur WHERE id = ?';
      const [result] = await pool.query(query, [dinosaurId]);
      const res = result as any;
      return res.affectedRows > 0;
    } catch (err) {
      console.error('Erreur lors de la suppression du dinosaure:', err);
      throw err;
    }
  }

  // Méthode pour mettre à jour le nom d'un dinosaure par l'ID utilisateur
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
