import { ShopDinosaurRepository } from '../repositories/shop-dinosaur.repository';
import { DinosaurSkillRepository } from '../repositories/dinosaur-skill.repository';
import { DinosaurItemRepository } from '../repositories/dinosaur-item.repository';
import { DinosaurBuildingRepository } from '../repositories/dinosaur-building.repository';
import { DinosaurSoulSkillRepository } from '../repositories/dinosaur-soul-skill.repository';
import { DinosaurSkillDTO } from '../models/dinosaur-skill.dto';
import { DinosaurItemDTO } from '../models/dinosaur-item.dto';
import { DinosaurBuildingDTO } from '../models/dinosaur-building.dto';
import { FrontendDinosaurDTO } from '../../dinosaurs/models/frontend-dinosaur.dto';
import { ShopAssetsDTO } from '../models/shop-assets.dto';
import { User } from '../../users/models/user.interface';
import { DinosaurSoulSkillInstanceDTO } from '../../dinosaurs/models/dinosaur-soul-skill-instance.dto';

/**
 * Service gérant les transactions de la boutique pour l'achat et l'upgrade des game assets.
 */
export class ShopService {
  constructor(
    private shopDinoRepo: ShopDinosaurRepository,
    private dinosaurSkillRepository: DinosaurSkillRepository,
    private dinosaurItemRepository: DinosaurItemRepository,
    private dinosaurBuildingRepository: DinosaurBuildingRepository,
    private dinosaurSoulSkillRepository: DinosaurSoulSkillRepository
  ) {}

  /**
   * Achat d'une compétence classique (coût en skill_points).
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
    if (dinosaur.skill_points < skill.price) {
      throw new Error('Points de compétence insuffisants pour acheter cette compétence');
    }

    // Déduction des skill_points
    dinosaur.skill_points -= skill.price;
    await this.shopDinoRepo.updateSkillPoints(dinosaur.id, dinosaur.skill_points);

    // Ajout de l'instance de compétence
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
   * Achat d'une Soul Skill (coût en soul points).
   */
  public async purchaseSoulSkill(
    dinosaur: FrontendDinosaurDTO,
    user: User,
    soulSkillId: number
  ): Promise<{ dinosaur: FrontendDinosaurDTO; message: string }> {
    const soulSkill: DinosaurSoulSkillInstanceDTO | null =
      await this.dinosaurSoulSkillRepository.getDinosaurSoulSkillById(soulSkillId);
    if (!soulSkill) {
      throw new Error('Soul Skill non trouvée');
    }
    if (dinosaur.soulSkills?.find(s => s.id === soulSkill.id && s.isUnlocked)) {
      throw new Error('Soul Skill déjà achetée');
    }

    // Vérification et déduction des points appropriés
    let currentPoints: number;
    let updatedPoints: number;
    switch (soulSkill.soulType) {
      case 'neutral':
        currentPoints = user.neutral_soul_points || 0;
        if (currentPoints < soulSkill.price) {
          throw new Error('Points neutres insuffisants');
        }
        updatedPoints = currentPoints - soulSkill.price;
        await this.shopDinoRepo.updateSoulPoints(user.id, 'neutral', updatedPoints);
        user.neutral_soul_points = updatedPoints;
        break;

      case 'bright':
        currentPoints = user.bright_soul_points || 0;
        if (currentPoints < soulSkill.price) {
          throw new Error('Points bright insuffisants');
        }
        updatedPoints = currentPoints - soulSkill.price;
        await this.shopDinoRepo.updateSoulPoints(user.id, 'bright', updatedPoints);
        user.bright_soul_points = updatedPoints;
        break;

      case 'dark':
        currentPoints = user.dark_soul_points || 0;
        if (currentPoints < soulSkill.price) {
          throw new Error('Points dark insuffisants');
        }
        updatedPoints = currentPoints - soulSkill.price;
        await this.shopDinoRepo.updateSoulPoints(user.id, 'dark', updatedPoints);
        user.dark_soul_points = updatedPoints;
        break;

      default:
        throw new Error('Type de soul inconnu');
    }

    // Ajout de l'instance de Soul Skill
    await this.shopDinoRepo.addSoulSkillInstance(dinosaur.id, soulSkill.id);

    // Mise à jour en mémoire pour la réponse
    dinosaur.soulSkills = dinosaur.soulSkills || [];
    const soulInstance = {
      ...soulSkill,
      isUnlocked: true,
      purchasedAt: new Date()
    };
    dinosaur.soulSkills.push(soulInstance);

    return { dinosaur, message: 'Soul Skill achetée avec succès' };
  }

  /**
   * Achat d'un item (coût en money).
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
    const existing = dinosaur.items.find(i => i.id === item.id);
    if (existing) {
      existing.currentLevelOrQuantity += 1;
    } else {
      dinosaur.items.push({
        ...item,
        currentLevelOrQuantity: 1,
        isEquipped: false
      });
    }

    return { dinosaur, message: 'Item acheté avec succès' };
  }

  /**
   * Upgrade d'un item persistant (coût en money).
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
    const building: DinosaurBuildingDTO | null =
      await this.dinosaurBuildingRepository.getDinosaurBuildingById(buildingId);
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
    const building: DinosaurBuildingDTO | null =
      await this.dinosaurBuildingRepository.getDinosaurBuildingById(buildingId);
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
    const soulSkills = await this.dinosaurSoulSkillRepository.getAllDinosaurSoulSkills();
    return { skills, items, buildings, soulSkills };
  }
}