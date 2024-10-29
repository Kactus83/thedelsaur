import pool from '../../../common/database/db';
import { Dinosaur } from '../models/dinosaur.interface';

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
    energy: number = 10000,
    max_energy: number = 10000,
    food: number = 10000,
    max_food: number = 10000,
    hunger: number = 0,
    max_hunger: number = 10000,
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
