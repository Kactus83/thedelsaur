import { ShopDinosaurRepository } from '../repositories/shop-dinosaur.repository';
import { DinosaurSkillRepository } from '../repositories/dinosaur-skill.repository';
import { DinosaurItemRepository } from '../repositories/dinosaur-item.repository';
import { DinosaurBuildingRepository } from '../repositories/dinosaur-building.repository';
import { DinosaurSkillDTO } from '../models/dinosaur-skill.dto';
import { DinosaurItemDTO } from '../models/dinosaur-item.dto';
import { DinosaurBuildingDTO } from '../models/dinosaur-building.dto';
import { FrontendDinosaurDTO } from '../../dinosaurs/models/frontend-dinosaur.dto';
import { ShopAssetsDTO } from '../models/shop-assets.dto';

/**
 * Service gérant les transactions de la boutique pour l'achat et l'upgrade des game assets.
 */
export class ShopService {
  constructor(
    private shopDinoRepo: ShopDinosaurRepository,
    private dinosaurSkillRepository: DinosaurSkillRepository,
    private dinosaurItemRepository: DinosaurItemRepository,
    private dinosaurBuildingRepository: DinosaurBuildingRepository,
  ) {}

  /**
   * Achat d'une compétence.
   */
  public async purchaseSkill(
    dinosaur: FrontendDinosaurDTO,
    skillId: number
  ): Promise<{ dinosaur: FrontendDinosaurDTO; message: string }> {
    const skill: DinosaurSkillDTO | null = await this.dinosaurSkillRepository.getDinosaurSkillById(skillId);
    if (!skill) {
      throw new Error('Compétence non trouvée');
    }
    if (dinosaur.skills.find((s) => s.id === skill.id && s.isPurchased)) {
      throw new Error('Compétence déjà achetée');
    }
    if (dinosaur.level < skill.minLevelToBuy) {
      throw new Error('Niveau insuffisant pour acheter cette compétence');
    }
    if (dinosaur.money < skill.price) {
      throw new Error('Fonds insuffisants pour acheter cette compétence');
    }

    dinosaur.money -= skill.price;
    await this.shopDinoRepo.updateMoney(dinosaur.id, dinosaur.money);
    await this.shopDinoRepo.addSkillInstance(
      dinosaur.id,
      skill.id,
      skill.type === 'triggered' ? false : null,
      null
    );

    // Mise à jour en mémoire pour la réponse
    const skillInstance = {
      ...skill,
      isPurchased: true,
      isActive: skill.type === 'triggered' ? false : undefined,
      lastActivatedAt: undefined,
    };
    dinosaur.skills.push(skillInstance);

    return { dinosaur, message: 'Compétence achetée avec succès' };
  }

  /**
   * Achat d'un item.
   */
  public async purchaseItem(
    dinosaur: FrontendDinosaurDTO,
    itemId: number
  ): Promise<{ dinosaur: FrontendDinosaurDTO; message: string }> {
    const item: DinosaurItemDTO | null = await this.dinosaurItemRepository.getDinosaurItemById(itemId);
    if (!item) {
      throw new Error('Item non trouvé');
    }
    if (dinosaur.level < item.minLevelToBuy) {
      throw new Error('Niveau insuffisant pour acheter cet item');
    }
    if (dinosaur.money < item.price) {
      throw new Error('Fonds insuffisants pour acheter cet item');
    }

    dinosaur.money -= item.price;
    await this.shopDinoRepo.updateMoney(dinosaur.id, dinosaur.money);
    await this.shopDinoRepo.addOrUpdateItemInstance(dinosaur.id, item.id, 1, false);

    // Mise à jour en mémoire pour la réponse
    const existingItem = dinosaur.items.find((i) => i.id === item.id);
    if (existingItem) {
      existingItem.currentLevelOrQuantity += 1;
    } else {
      const itemInstance = {
        ...item,
        currentLevelOrQuantity: 1,
        isEquipped: false,
      };
      dinosaur.items.push(itemInstance);
    }

    return { dinosaur, message: 'Item acheté avec succès' };
  }

  /**
   * Upgrade d'un item persistant.
   */
  public async upgradeItem(
    dinosaur: FrontendDinosaurDTO,
    itemId: number
  ): Promise<{ dinosaur: FrontendDinosaurDTO; message: string }> {
    const item: DinosaurItemDTO | null = await this.dinosaurItemRepository.getDinosaurItemById(itemId);
    if (!item) {
      throw new Error('Item non trouvé');
    }
    if (item.itemType !== 'persistent') {
      throw new Error('Seuls les items persistants peuvent être upgradés');
    }
    const itemInstance = dinosaur.items.find((i) => i.id === item.id);
    if (!itemInstance) {
      throw new Error("Item non acquis, veuillez l'acheter d'abord");
    }

    const currentLevel = itemInstance.currentLevelOrQuantity;
    const levels = item.levels.sort((a, b) => a.level - b.level);
    const nextLevel = levels.find((lvl) => lvl.level === currentLevel + 1);
    if (!nextLevel) {
      throw new Error('Item déjà au niveau maximum');
    }
    if (dinosaur.money < nextLevel.price) {
      throw new Error("Fonds insuffisants pour upgrader cet item");
    }

    dinosaur.money -= nextLevel.price;
    await this.shopDinoRepo.updateMoney(dinosaur.id, dinosaur.money);
    const newLevel = currentLevel + 1;
    await this.shopDinoRepo.updateItemInstanceLevel(dinosaur.id, item.id, newLevel);
    itemInstance.currentLevelOrQuantity = newLevel;

    return { dinosaur, message: 'Item upgradé avec succès' };
  }

  /**
   * Achat d'un bâtiment.
   */
  public async purchaseBuilding(
    dinosaur: FrontendDinosaurDTO,
    buildingId: number
  ): Promise<{ dinosaur: FrontendDinosaurDTO; message: string }> {
    const building: DinosaurBuildingDTO | null = await this.dinosaurBuildingRepository.getDinosaurBuildingById(buildingId);
    if (!building) {
      throw new Error('Bâtiment non trouvé');
    }
    if (dinosaur.level < building.minLevelToBuy) {
      throw new Error('Niveau insuffisant pour acheter ce bâtiment');
    }
    if (dinosaur.money < building.price) {
      throw new Error('Fonds insuffisants pour acheter ce bâtiment');
    }
    if (dinosaur.buildings.find((b) => b.id === building.id)) {
      throw new Error('Bâtiment déjà acquis');
    }

    dinosaur.money -= building.price;
    await this.shopDinoRepo.updateMoney(dinosaur.id, dinosaur.money);
    await this.shopDinoRepo.addBuildingInstance(dinosaur.id, building.id, 1, {});
    const buildingInstance = {
      ...building,
      currentLevel: 1,
      purchasedUpgrades: {}
    };
    dinosaur.buildings.push(buildingInstance);

    return { dinosaur, message: 'Bâtiment acheté avec succès' };
  }

  /**
   * Upgrade d'un bâtiment (achat d'un upgrade spécifique).
   */
  public async upgradeBuilding(
    dinosaur: FrontendDinosaurDTO,
    buildingId: number,
    upgradeId: number
  ): Promise<{ dinosaur: FrontendDinosaurDTO; message: string }> {
    const building: DinosaurBuildingDTO | null = await this.dinosaurBuildingRepository.getDinosaurBuildingById(buildingId);
    if (!building) {
      throw new Error('Bâtiment non trouvé');
    }
    const buildingInstance = dinosaur.buildings.find((b) => b.id === building.id);
    if (!buildingInstance) {
      throw new Error("Bâtiment non acquis, veuillez l'acheter d'abord");
    }
    const improvementNode = building.improvementTree.find((node) => node.id === upgradeId);
    if (!improvementNode) {
      throw new Error("Upgrade non trouvé pour ce bâtiment");
    }
    if (buildingInstance.purchasedUpgrades[upgradeId]) {
      throw new Error("Upgrade déjà acheté pour ce bâtiment");
    }
    if (dinosaur.money < improvementNode.cost) {
      throw new Error("Fonds insuffisants pour acheter cet upgrade");
    }

    dinosaur.money -= improvementNode.cost;
    await this.shopDinoRepo.updateMoney(dinosaur.id, dinosaur.money);
    buildingInstance.purchasedUpgrades[upgradeId] = true;
    await this.shopDinoRepo.updateBuildingInstance(
      dinosaur.id,
      building.id,
      buildingInstance.currentLevel,
      buildingInstance.purchasedUpgrades
    );

    return { dinosaur, message: 'Upgrade de bâtiment acheté avec succès' };
  }

  /**
   * Récupère l'ensemble des game assets disponibles.
   */
  public async getAllAssets(): Promise<ShopAssetsDTO> {
    const skills = await this.dinosaurSkillRepository.getAllDinosaurSkills();
    const items = await this.dinosaurItemRepository.getAllDinosaurItems();
    const buildings = await this.dinosaurBuildingRepository.getAllDinosaurBuildings();
    return { skills, items, buildings };
  }
}
