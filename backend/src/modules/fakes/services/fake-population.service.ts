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
  const ratio = (xp - XP_MIN) / (XP_MAX - XP_MIN);
  return Math.floor(1 + 49 * Math.pow(ratio, 0.5));
};

const formatSqlDate = (date: Date): string => date.toISOString().slice(0, 19).replace('T', ' ');

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
      // Pour les diètes et types, on suppose que :
      //   - dinosaur_diets : 1 = Herbivore, 2 = Carnivore, 3 = Omnivore
      //   - dinosaur_types : 1 = Land, 2 = Air, 3 = Sea
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

        // Générer un nombre aléatoire (1 à 10) de vies antérieures pour ce dinosaure
        const livesCount = randomInt(1, 11);
        for (let j = 0; j < livesCount; j++) {
          const lifeName = `Life_${j + 1}`;
          const lifeExperience = randomInt(100, 50000);
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

        // Peuplement basique des assets
        const skillsCount = randomInt(0, 4);
        for (let k = 0; k < skillsCount; k++) {
          await this.repo.createFakeSkillInstance({
            dinosaur_id: dinoId,
            skill_id: randomInt(1, 11),
            is_purchased: true
          });
        }
        const itemsCount = randomInt(0, 4);
        for (let k = 0; k < itemsCount; k++) {
          await this.repo.createFakeItemInstance({
            dinosaur_id: dinoId,
            item_id: randomInt(1, 11),
            current_level_or_quantity: randomInt(1, 6),
            is_equipped: Math.random() < 0.5
          });
        }
        const buildingsCount = randomInt(0, 3);
        for (let k = 0; k < buildingsCount; k++) {
          await this.repo.createFakeBuildingInstance({
            dinosaur_id: dinoId,
            building_id: randomInt(1, 6),
            current_level: randomInt(1, 4)
          });
        }
        const soulSkillsCount = randomInt(0, 3);
        for (let k = 0; k < soulSkillsCount; k++) {
          await this.repo.createFakeSoulSkillInstance({
            dinosaur_id: dinoId,
            soul_skill_id: randomInt(1, 6),
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
