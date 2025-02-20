import pool from '../../../common/database/db';
import { RowDataPacket } from 'mysql2';
import { DinosaurSkillInstanceDTO } from '../models/dinosaur-skill-instance.dto';
import { DinosaurItemInstanceDTO } from '../models/dinosaur-item-instance.dto';
import { DinosaurBuildingInstanceDTO } from '../models/dinosaur-building-instance.dto';

/**
 * Interface décrivant une ligne de la table dinosaur_skills_instance.
 */
interface DatabaseDinosaurSkillInstanceRow extends RowDataPacket {
  dinosaur_id: number;
  skill_id: number;
  is_purchased: number; // stocké en TINYINT(1)
  is_active: number | null; // stocké en TINYINT(1) ou NULL
  last_activated_at: Date | null;
}

/**
 * Interface décrivant une ligne de la table dinosaur_items_instance.
 */
interface DatabaseDinosaurItemInstanceRow extends RowDataPacket {
  dinosaur_id: number;
  item_id: number;
  current_level_or_quantity: number;
  is_equipped: number; // TINYINT(1)
}

/**
 * Interface décrivant une ligne de la table dinosaur_buildings_instance.
 */
interface DatabaseDinosaurBuildingInstanceRow extends RowDataPacket {
  dinosaur_id: number;
  building_id: number;
  current_level: number;
  purchased_upgrades: string; // JSON
}

/**
 * Repository dédié à la gestion des assets d'un dinosaure.
 * Ce repository permet de récupérer et de mettre à jour les instances de skills, items et buildings possédées par un dinosaure.
 */
export class DinosaurGameAssetsRepository {

  /**
   * Récupère toutes les instances de skills associées à un dinosaure.
   * @param dinosaurId Identifiant du dinosaure.
   * @returns Une liste d'instances de skills.
   */
  public async getSkillInstancesByDinosaurId(dinosaurId: number): Promise<DinosaurSkillInstanceDTO[]> {
    try {
      const [rows] = await pool.query<DatabaseDinosaurSkillInstanceRow[]>(
        `SELECT * FROM dinosaur_skills_instance WHERE dinosaur_id = ?`,
        [dinosaurId]
      );
      return rows.map(row => ({
        id: row.skill_id,
        isPurchased: !!row.is_purchased,
        isActive: row.is_active !== null ? !!row.is_active : undefined,
        lastActivatedAt: row.last_activated_at ? new Date(row.last_activated_at) : undefined
      })) as DinosaurSkillInstanceDTO[];
    } catch (error) {
      console.error("Error fetching dinosaur skill instances:", error);
      throw error;
    }
  }

  /**
   * Met à jour une instance de skill pour un dinosaure.
   * @param dinosaurId Identifiant du dinosaure.
   * @param skillInstance Instance de skill à mettre à jour.
   * @returns true si la mise à jour a réussi, false sinon.
   */
  public async updateSkillInstance(dinosaurId: number, skillInstance: DinosaurSkillInstanceDTO): Promise<boolean> {
    try {
      const query = `
        UPDATE dinosaur_skills_instance
        SET is_purchased = ?, is_active = ?, last_activated_at = ?
        WHERE dinosaur_id = ? AND skill_id = ?
      `;
      const values = [
        skillInstance.isPurchased ? 1 : 0,
        skillInstance.isActive !== undefined ? (skillInstance.isActive ? 1 : 0) : null,
        skillInstance.lastActivatedAt ? skillInstance.lastActivatedAt : null,
        dinosaurId,
        skillInstance.id
      ];
      const [result] = await pool.query(query, values);
      const resAny = result as any;
      return resAny.affectedRows > 0;
    } catch (error) {
      console.error("Error updating dinosaur skill instance:", error);
      throw error;
    }
  }

  /**
   * Récupère toutes les instances d'items associées à un dinosaure.
   * @param dinosaurId Identifiant du dinosaure.
   * @returns Une liste d'instances d'items.
   */
  public async getItemInstancesByDinosaurId(dinosaurId: number): Promise<DinosaurItemInstanceDTO[]> {
    try {
      const [rows] = await pool.query<DatabaseDinosaurItemInstanceRow[]>(
        `SELECT * FROM dinosaur_items_instance WHERE dinosaur_id = ?`,
        [dinosaurId]
      );
      return rows.map(row => ({
        id: row.item_id,
        currentLevelOrQuantity: row.current_level_or_quantity,
        isEquipped: !!row.is_equipped
      })) as DinosaurItemInstanceDTO[];
    } catch (error) {
      console.error("Error fetching dinosaur item instances:", error);
      throw error;
    }
  }

  /**
   * Met à jour une instance d'item pour un dinosaure.
   * @param dinosaurId Identifiant du dinosaure.
   * @param itemInstance Instance d'item à mettre à jour.
   * @returns true si la mise à jour a réussi, false sinon.
   */
  public async updateItemInstance(dinosaurId: number, itemInstance: DinosaurItemInstanceDTO): Promise<boolean> {
    try {
      const query = `
        UPDATE dinosaur_items_instance
        SET current_level_or_quantity = ?, is_equipped = ?
        WHERE dinosaur_id = ? AND item_id = ?
      `;
      const values = [
        itemInstance.currentLevelOrQuantity,
        itemInstance.isEquipped ? 1 : 0,
        dinosaurId,
        itemInstance.id
      ];
      const [result] = await pool.query(query, values);
      const resAny = result as any;
      return resAny.affectedRows > 0;
    } catch (error) {
      console.error("Error updating dinosaur item instance:", error);
      throw error;
    }
  }

  /**
   * Récupère toutes les instances de bâtiments associées à un dinosaure.
   * @param dinosaurId Identifiant du dinosaure.
   * @returns Une liste d'instances de bâtiments.
   */
  public async getBuildingInstancesByDinosaurId(dinosaurId: number): Promise<DinosaurBuildingInstanceDTO[]> {
    try {
      const [rows] = await pool.query<DatabaseDinosaurBuildingInstanceRow[]>(
        `SELECT * FROM dinosaur_buildings_instance WHERE dinosaur_id = ?`,
        [dinosaurId]
      );
      return rows.map(row => ({
        id: row.building_id,
        currentLevel: row.current_level,
        purchasedUpgrades: JSON.parse(row.purchased_upgrades)
      })) as DinosaurBuildingInstanceDTO[];
    } catch (error) {
      console.error("Error fetching dinosaur building instances:", error);
      throw error;
    }
  }

  /**
   * Met à jour une instance de bâtiment pour un dinosaure.
   * @param dinosaurId Identifiant du dinosaure.
   * @param buildingInstance Instance de bâtiment à mettre à jour.
   * @returns true si la mise à jour a réussi, false sinon.
   */
  public async updateBuildingInstance(dinosaurId: number, buildingInstance: DinosaurBuildingInstanceDTO): Promise<boolean> {
    try {
      const query = `
        UPDATE dinosaur_buildings_instance
        SET current_level = ?, purchased_upgrades = ?
        WHERE dinosaur_id = ? AND building_id = ?
      `;
      const values = [
        buildingInstance.currentLevel,
        JSON.stringify(buildingInstance.purchasedUpgrades),
        dinosaurId,
        buildingInstance.id
      ];
      const [result] = await pool.query(query, values);
      const resAny = result as any;
      return resAny.affectedRows > 0;
    } catch (error) {
      console.error("Error updating dinosaur building instance:", error);
      throw error;
    }
  }

  /**
   * Exemple de méthode pour le shop : achat d'un skill.
   * Insère une nouvelle instance ou met à jour l'existante.
   * @param dinosaurId Identifiant du dinosaure.
   * @param skillInstance Instance de skill à acheter.
   * @returns true si l'opération a réussi.
   */
  public async purchaseSkill(dinosaurId: number, skillInstance: DinosaurSkillInstanceDTO): Promise<boolean> {
    try {
      const query = `
        INSERT INTO dinosaur_skills_instance (dinosaur_id, skill_id, is_purchased, is_active, last_activated_at)
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE is_purchased = VALUES(is_purchased)
      `;
      const values = [
        dinosaurId,
        skillInstance.id,
        skillInstance.isPurchased ? 1 : 0,
        skillInstance.isActive !== undefined ? (skillInstance.isActive ? 1 : 0) : null,
        skillInstance.lastActivatedAt ? skillInstance.lastActivatedAt : null
      ];
      const [result] = await pool.query(query, values);
      const resAny = result as any;
      return resAny.affectedRows > 0;
    } catch (error) {
      console.error("Error purchasing dinosaur skill:", error);
      throw error;
    }
  }

  // D'autres méthodes spécifiques (ex. activation, upgrade via le shop) pourront être ajoutées ici.
}
