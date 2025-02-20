import { Router } from 'express';
import { DinosaurSkillRepository } from './repositories/dinosaur-skill.repository';
import { DinosaurItemRepository } from './repositories/dinosaur-item.repository';
import { DinosaurBuildingRepository } from './repositories/dinosaur-building.repository';

/**
 * Module Game‑Assets.
 * Gère le peuplage de la base de définitions d'assets (skills, items, bâtiments).
 */
export class GameAssetsModule {
  public router: Router;

  private skillRepository: DinosaurSkillRepository;
  private itemRepository: DinosaurItemRepository;
  private buildingRepository: DinosaurBuildingRepository;

  constructor() {
    this.skillRepository = new DinosaurSkillRepository();
    this.itemRepository = new DinosaurItemRepository();
    this.buildingRepository = new DinosaurBuildingRepository();

    // Pour l'instant, aucun routage spécifique n'est défini.
    this.router = Router();
  }

  /**
   * Effectue le peuplage des définitions si les tables sont vides.
   */
  public async seedGameAssets(): Promise<void> {
    await this.skillRepository.seedDinosaurSkillsIfEmpty();
    await this.itemRepository.seedDinosaurItemsIfEmpty();
    await this.buildingRepository.seedDinosaurBuildingsIfEmpty();
    console.log('Game Assets have been seeded.');
  }
}
