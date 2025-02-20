import { Request, Response } from 'express';
import { ShopService } from '../services/shop.service';
import { AuthenticatedRequest } from '../../auth/middlewares/authMiddleware';
import { plainToInstance } from 'class-transformer';
import { ShopAssetsDTO } from '../models/shop-assets.dto';
import { FrontendDinosaurDTO } from '../../dinosaurs/models/frontend-dinosaur.dto';

/**
 * Contrôleur dédié aux opérations de la boutique pour l'ensemble des game assets.
 */
export class ShopController {
  constructor(private shopService: ShopService) {}

  /**
   * Récupère tous les assets disponibles.
   * Route : GET /shop/assets
   */
  public getAllAssets = async (req: Request, res: Response) => {
    try {
      const assets: ShopAssetsDTO = await this.shopService.getAllAssets();
      return res.status(200).json(assets);
    } catch (error: any) {
      console.error('Erreur lors de la récupération des assets :', error);
      return res.status(500).json({ message: error.message || 'Erreur interne du serveur' });
    }
  };

  /**
   * Achat d'une compétence.
   * Route : POST /shop/skills/:skillId
   */
  public purchaseSkill = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const dinosaur = req.dinosaur as FrontendDinosaurDTO;
      if (!dinosaur) {
        return res.status(400).json({ message: 'Dinosaure non trouvé' });
      }
      const skillId = Number(req.params.skillId);
      if (isNaN(skillId)) {
        return res.status(400).json({ message: 'Identifiant de compétence invalide' });
      }
      const { dinosaur: updatedDino, message } = await this.shopService.purchaseSkill(dinosaur, skillId);
      const dinosaurDTO = plainToInstance(FrontendDinosaurDTO, updatedDino);
      return res.status(200).json({ message, dinosaur: dinosaurDTO });
    } catch (error: any) {
      console.error('Erreur lors de l\'achat de la compétence :', error);
      return res.status(500).json({ message: error.message || 'Erreur interne du serveur' });
    }
  };

  /**
   * Achat d'un item.
   * Route : POST /shop/items/:itemId
   */
  public purchaseItem = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const dinosaur = req.dinosaur as FrontendDinosaurDTO;
      if (!dinosaur) {
        return res.status(400).json({ message: 'Dinosaure non trouvé' });
      }
      const itemId = Number(req.params.itemId);
      if (isNaN(itemId)) {
        return res.status(400).json({ message: 'Identifiant d\'item invalide' });
      }
      const { dinosaur: updatedDino, message } = await this.shopService.purchaseItem(dinosaur, itemId);
      const dinosaurDTO = plainToInstance(FrontendDinosaurDTO, updatedDino);
      return res.status(200).json({ message, dinosaur: dinosaurDTO });
    } catch (error: any) {
      console.error('Erreur lors de l\'achat de l\'item :', error);
      return res.status(500).json({ message: error.message || 'Erreur interne du serveur' });
    }
  };

  /**
   * Upgrade d'un item.
   * Route : PATCH /shop/items/:itemId/upgrade
   */
  public upgradeItem = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const dinosaur = req.dinosaur as FrontendDinosaurDTO;
      if (!dinosaur) {
        return res.status(400).json({ message: 'Dinosaure non trouvé' });
      }
      const itemId = Number(req.params.itemId);
      if (isNaN(itemId)) {
        return res.status(400).json({ message: 'Identifiant d\'item invalide' });
      }
      const { dinosaur: updatedDino, message } = await this.shopService.upgradeItem(dinosaur, itemId);
      const dinosaurDTO = plainToInstance(FrontendDinosaurDTO, updatedDino);
      return res.status(200).json({ message, dinosaur: dinosaurDTO });
    } catch (error: any) {
      console.error('Erreur lors de l\'upgrade de l\'item :', error);
      return res.status(500).json({ message: error.message || 'Erreur interne du serveur' });
    }
  };

  /**
   * Achat d'un bâtiment.
   * Route : POST /shop/buildings/:buildingId
   */
  public purchaseBuilding = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const dinosaur = req.dinosaur as FrontendDinosaurDTO;
      if (!dinosaur) {
        return res.status(400).json({ message: 'Dinosaure non trouvé' });
      }
      const buildingId = Number(req.params.buildingId);
      if (isNaN(buildingId)) {
        return res.status(400).json({ message: 'Identifiant de bâtiment invalide' });
      }
      const { dinosaur: updatedDino, message } = await this.shopService.purchaseBuilding(dinosaur, buildingId);
      const dinosaurDTO = plainToInstance(FrontendDinosaurDTO, updatedDino);
      return res.status(200).json({ message, dinosaur: dinosaurDTO });
    } catch (error: any) {
      console.error('Erreur lors de l\'achat du bâtiment :', error);
      return res.status(500).json({ message: error.message || 'Erreur interne du serveur' });
    }
  };

  /**
   * Upgrade d'un bâtiment (achat d'un upgrade spécifique).
   * Route : PATCH /shop/buildings/:buildingId/upgrade/:upgradeId
   */
  public upgradeBuilding = async (req: AuthenticatedRequest, res: Response) => {
    try {
      const dinosaur = req.dinosaur as FrontendDinosaurDTO;
      if (!dinosaur) {
        return res.status(400).json({ message: 'Dinosaure non trouvé' });
      }
      const buildingId = Number(req.params.buildingId);
      const upgradeId = Number(req.params.upgradeId);
      if (isNaN(buildingId) || isNaN(upgradeId)) {
        return res.status(400).json({ message: 'Identifiants invalides' });
      }
      const { dinosaur: updatedDino, message } = await this.shopService.upgradeBuilding(dinosaur, buildingId, upgradeId);
      const dinosaurDTO = plainToInstance(FrontendDinosaurDTO, updatedDino);
      return res.status(200).json({ message, dinosaur: dinosaurDTO });
    } catch (error: any) {
      console.error('Erreur lors de l\'upgrade du bâtiment :', error);
      return res.status(500).json({ message: error.message || 'Erreur interne du serveur' });
    }
  };
}
