import { BASE_ENERGY, MAX_FOOD } from '../../../common/config/constants';
import pool from '../../../common/database/db';
import { Dinosaur } from '../models/dinosaur.interface';

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
        max_food: MAX_FOOD * dinosaurData.max_food_multiplier,
        max_energy: BASE_ENERGY * dinosaurData.max_energy_multiplier,
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
        max_food: MAX_FOOD * dinosaurData.max_food_multiplier,
        max_energy: BASE_ENERGY * dinosaurData.max_energy_multiplier,
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
        // Récupérer le dinosaure actuel pour obtenir les multiplicateurs existants si nécessaires
        const currentDinosaur = await this.getDinosaurById(dinosaurId);
        if (!currentDinosaur) {
            throw new Error('Dinosaure introuvable');
        }

        // Utiliser les multiplicateurs actuels si les nouveaux ne sont pas fournis
        const multipliers = updates.multipliers || currentDinosaur.multipliers;

        // Recalculer max_food et max_energy en utilisant les multiplicateurs actuels ou fournis
        updates.max_food = MAX_FOOD * (multipliers.max_food_multiplier || 1);
        updates.max_energy = BASE_ENERGY * (multipliers.max_energy_multiplier || 1);

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
