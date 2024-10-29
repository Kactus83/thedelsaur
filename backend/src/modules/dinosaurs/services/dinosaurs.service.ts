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
  // Récupérer un dinosaure par son ID
  public async getDinosaurById(dinosaurId: number): Promise<Dinosaur | null> {
    try {
      const [results] = await pool.query('SELECT * FROM dinosaur WHERE id = ?', [dinosaurId]);
      const dinosaurs = results as Dinosaur[];
      return dinosaurs.length > 0 ? dinosaurs[0] : null;
    } catch (err) {
      console.error('Erreur lors de la récupération du dinosaure:', err);
      throw err;
    }
  }

  // Récupérer le dinosaure associé à un utilisateur
  public async getDinosaurByUserId(userId: number): Promise<Dinosaur | null> {
    try {
      const [results] = await pool.query('SELECT * FROM dinosaur WHERE user_id = ?', [userId]);
      const dinosaurs = results as Dinosaur[];
      return dinosaurs.length > 0 ? dinosaurs[0] : null;
    } catch (err) {
      console.error('Erreur lors de la récupération du dinosaure par userId:', err);
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
    energy: number = BASE_ENERGY,
    max_energy: number = BASE_ENERGY,
    food: number = BASE_FOOD,
    max_food: number = MAX_FOOD,
    hunger: number = 0,
    max_hunger: number = BASE_MAX_HUNGER,
    experience: number = 0,
    epoch: string = 'past',
    isSleeping: boolean = false,
    isDead: boolean = false
  ): Promise<number> {
    try {
      const query = `INSERT INTO dinosaur (name, user_id, diet, energy, max_energy, food, max_food, hunger, max_hunger, experience, epoch, isSleeping, isDead)
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
      const [result] = await pool.query(query, [name, userId, diet, energy, max_energy, food, max_food, hunger, max_hunger, experience, epoch, isSleeping, isDead]);
      const res = result as any;
      return res.insertId;
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
}
