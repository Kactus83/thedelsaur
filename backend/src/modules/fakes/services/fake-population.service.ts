import { FakePopulationRepository } from '../repositories/fake-population.repository';
import { DINOSAUR_CONSTANTS } from '../../../common/config/dinosaur.constants';
import { Epoch } from '../../dinosaurs/models/epoch.enum';
import { randomInt } from 'crypto';

// Plages pour l'expérience
const XP_MIN = 1000;
const XP_MAX = 500000;

// Fonctions utilitaires pour calculer des valeurs à partir de l'xp
const computeExponentialValue = (xp: number, minValue: number, maxValue: number, exponent: number = 2): number => {
  const ratio = (xp - XP_MIN) / (XP_MAX - XP_MIN);
  return minValue + (maxValue - minValue) * Math.pow(ratio, exponent);
};

const computeLevel = (xp: number): number => {
  // Si xp est inférieur à XP_MIN, utiliser XP_MIN pour éviter NaN
  const safeXp = xp < XP_MIN ? XP_MIN : xp;
  const ratio = (safeXp - XP_MIN) / (XP_MAX - XP_MIN);
  return Math.floor(1 + 49 * Math.pow(ratio, 0.5));
};

const formatSqlDate = (date: Date): string => date.toISOString().slice(0, 19).replace('T', ' ');

// Constantes pour le nombre d'assets insérés par défaut
const DEFAULT_SKILL_COUNT = 10;
const DEFAULT_ITEM_COUNT = 10;
const DEFAULT_BUILDING_COUNT = 5;
const DEFAULT_SOUL_SKILL_COUNT = 5;

const availableEpochs: Epoch[] = [
  Epoch.Prehistoric_Epoch1, Epoch.Prehistoric_Epoch2, Epoch.Prehistoric_Epoch3, Epoch.Prehistoric_Epoch4,
  Epoch.Ancient_Epoch1, Epoch.Ancient_Epoch2, Epoch.Ancient_Epoch3, Epoch.Ancient_Epoch4,
  Epoch.Medieval_Epoch1, Epoch.Medieval_Epoch2, Epoch.Medieval_Epoch3, Epoch.Medieval_Epoch4,
  Epoch.Modern_Epoch1, Epoch.Modern_Epoch2, Epoch.Modern_Epoch3, Epoch.Modern_Epoch4,
  Epoch.Future_Epoch1, Epoch.Future_Epoch2, Epoch.Future_Epoch3, Epoch.Future_Epoch4,
];

export class FakePopulationService {
  private repo: FakePopulationRepository;

  constructor() {
    this.repo = new FakePopulationRepository();
  }

  /**
   * Génère des faux utilisateurs et dinosaures cohérents.
   * Un utilisateur ne peut avoir qu'un seul dinosaure.
   * @param userCount Nombre de faux utilisateurs à créer.
   * @param dinoCount Nombre de dinosaures à créer (sera limité au nombre d'utilisateurs créés).
   */
  public async populateFakeData(userCount: number, dinoCount: number): Promise<{ usersCreated: number; dinosaursCreated: number }> {
    let usersCreated = 0;
    let dinosaursCreated = 0;
    const userIds: number[] = [];

    // Création des faux utilisateurs
    for (let i = 0; i < userCount; i++) {
      const username = `fakeUser_${Date.now()}_${i}`;
      const email = `${username}@example.com`;
      const passwordHash = "hashed_password"; // Chaîne fixe pour les tests
      try {
        const userId = await this.repo.createFakeUser({ username, email, passwordHash, isAdmin: false });
        userIds.push(userId);
        usersCreated++;
      } catch (error) {
        console.error(`Erreur lors de la création de l'utilisateur ${username} :`, error);
      }
    }

    if (userIds.length === 0) {
      throw new Error("Aucun utilisateur n'a été créé, impossible de créer des dinosaures.");
    }

    const now = new Date();
    const nowSql = formatSqlDate(now);

    // On ne peut créer qu'un dinosaure par utilisateur
    const dinosaursToCreate = Math.min(userIds.length, dinoCount);

    for (let i = 0; i < dinosaursToCreate; i++) {
      // On utilise l'utilisateur à l'index i pour garantir l'unicité
      const userId = userIds[i];
      // Pour les diètes et types, on suppose que les id vont de 1 à 3
      const diet_id = randomInt(1, 4);
      const type_id = randomInt(1, 4);

      const name = `FakeDino_${Date.now()}_${i}`;
      const energy = DINOSAUR_CONSTANTS.INITIAL_ENERGY;
      const food = DINOSAUR_CONSTANTS.INITIAL_FOOD;
      const hunger = DINOSAUR_CONSTANTS.INITIAL_HUNGER;

      const experience = randomInt(XP_MIN, XP_MAX + 1);
      const level = computeLevel(experience);
      const money = Math.round(1000 + computeExponentialValue(experience, 0, 4000));
      const weapons = Math.round(computeExponentialValue(experience, 0, 20));
      const armors = Math.round(computeExponentialValue(experience, 0, 20));
      const friends = Math.round(computeExponentialValue(experience, 0, 50));
      const employees = Math.round(computeExponentialValue(experience, 0, 20));
      const skill_points = Math.round(computeExponentialValue(experience, 0, 100));

      const epoch = availableEpochs[randomInt(0, availableEpochs.length)];

      try {
        const dinoId = await this.repo.createFakeDinosaur({
          name,
          user_id: userId,
          diet_id,
          type_id,
          energy,
          food,
          hunger,
          weapons,
          armors,
          friends,
          employees,
          karma: randomInt(-DINOSAUR_CONSTANTS.KARMA_WIDTH, DINOSAUR_CONSTANTS.KARMA_WIDTH + 1),
          experience,
          level,
          money,
          skill_points,
          epoch,
          created_at: nowSql,
          last_reborn: nowSql,
          reborn_amount: 0,
          last_update_by_time_service: nowSql,
          is_sleeping: false,
          is_dead: false
        });
        dinosaursCreated++;

        // Pour les vies, on s'assure que l'expérience est toujours >= XP_MIN
        const livesCount = randomInt(1, 11);
        for (let j = 0; j < livesCount; j++) {
          const lifeName = `Life_${j + 1}`;
          // Assurer que l'expérience de vie est >= XP_MIN
          const lifeExperience = randomInt(XP_MIN, 50000 + 1);
          const lifeKarma = randomInt(-DINOSAUR_CONSTANTS.KARMA_WIDTH, DINOSAUR_CONSTANTS.KARMA_WIDTH + 1);
          const lifeLevel = computeLevel(lifeExperience);
          const birthDate = formatSqlDate(new Date(now.getTime() - randomInt(1000000, 5000000)));
          const deathDate = formatSqlDate(new Date(now.getTime() - randomInt(100000, 900000)));
          const soul_points = Math.round(lifeExperience * DINOSAUR_CONSTANTS.EXP_TO_SOUL_POINTS_CONVERSION_RATIO);
          await this.repo.createFakeDinosaurLife({
            dinosaur_id: dinoId,
            name: lifeName,
            experience: lifeExperience,
            karma: lifeKarma,
            level: lifeLevel,
            birth_date: birthDate,
            death_date: deathDate,
            soul_points,
            dark_soul_points: Math.round(soul_points * 0.5),
            bright_soul_points: Math.round(soul_points * 0.5)
          });
        }

        // Peuplement des assets en s'assurant l'unicité pour éviter les doublons

        // Pour skills
        const skillsCount = randomInt(0, 4);
        const chosenSkillIds = new Set<number>();
        while (chosenSkillIds.size < skillsCount) {
          chosenSkillIds.add(randomInt(1, DEFAULT_SKILL_COUNT + 1));
        }
        for (const skillId of chosenSkillIds) {
          await this.repo.createFakeSkillInstance({
            dinosaur_id: dinoId,
            skill_id: skillId,
            is_purchased: true
          });
        }

        // Pour items
        const itemsCount = randomInt(0, 4);
        const chosenItemIds = new Set<number>();
        while (chosenItemIds.size < itemsCount) {
          chosenItemIds.add(randomInt(1, DEFAULT_ITEM_COUNT + 1));
        }
        for (const itemId of chosenItemIds) {
          await this.repo.createFakeItemInstance({
            dinosaur_id: dinoId,
            item_id: itemId,
            current_level_or_quantity: randomInt(1, 6),
            is_equipped: Math.random() < 0.5
          });
        }

        // Pour buildings (éviter les doublons car une instance unique par bâtiment)
        const buildingsCount = randomInt(0, 3);
        const chosenBuildingIds = new Set<number>();
        while (chosenBuildingIds.size < buildingsCount) {
          chosenBuildingIds.add(randomInt(1, DEFAULT_BUILDING_COUNT + 1));
        }
        for (const buildingId of chosenBuildingIds) {
          await this.repo.createFakeBuildingInstance({
            dinosaur_id: dinoId,
            building_id: buildingId,
            current_level: randomInt(1, 4)
          });
        }

        // Pour soul skills
        const soulSkillsCount = randomInt(0, 3);
        const chosenSoulSkillIds = new Set<number>();
        while (chosenSoulSkillIds.size < soulSkillsCount) {
          chosenSoulSkillIds.add(randomInt(1, DEFAULT_SOUL_SKILL_COUNT + 1));
        }
        for (const soulSkillId of chosenSoulSkillIds) {
          await this.repo.createFakeSoulSkillInstance({
            dinosaur_id: dinoId,
            soul_skill_id: soulSkillId,
            is_unlocked: true,
            purchased_at: nowSql
          });
        }
      } catch (error) {
        console.error(`Erreur lors de la création du dinosaure ${name} :`, error);
      }
    }

    return { usersCreated, dinosaursCreated };
  }
}
