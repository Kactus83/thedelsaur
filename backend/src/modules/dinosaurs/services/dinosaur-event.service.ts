import { DinosaurAction } from '../models/dinosaur-action.enum';
import { DinosaurEvent } from '../models/dinosaur-event.interface';
import { DinosaurActionsMap } from '../libs/dinosaur-actions.mapping';
import { DinosaurActionDTO } from '../models/dinosaur-action.dto';
import { FrontendDinosaurDTO } from '../models/frontend-dinosaur.dto';
import { DynamicEventRepository } from '../repositories/dynamic-event.repository';
import { DynamicEvent } from '../models/dynamic-event';
import { AfterlifeService } from './afterlife.service';
import { DinosaurFactory } from '../factories/dinosaur.factory';
import { getExperienceThresholdForLevel, getSkillPointsForLevel } from '../utils/levelThresholds';

/**
 * Service pour gérer les événements liés aux actions du dinosaure.
 * Il encapsule la logique pour :
 * - Récupérer les actions disponibles pour un dinosaure,
 * - Sélectionner un événement dynamique adapté à une action,
 * - Appliquer les effets de l'événement sur le dinosaure,
 * - Gérer la résurrection en enregistrant l'historique de vie (afterlife).
 */
export class DinosaurEventService {
  private dynamicEventRepo: DynamicEventRepository;
  private afterlifeService: AfterlifeService;
  private dinosaurFactory: DinosaurFactory;

  /**
   * Constructeur du service.
   * @param dynamicEventRepo Instance du repository pour les événements dynamiques.
   * @param afterlifeService Instance du service afterlife pour enregistrer l'historique des vies.
   * @param dinosaurFactory Instance de la factory pour la résurrection du dinosaure.
   */
  constructor(
    dynamicEventRepo: DynamicEventRepository,
    afterlifeService: AfterlifeService,
    dinosaurFactory: DinosaurFactory
  ) {
    this.dynamicEventRepo = dynamicEventRepo;
    this.afterlifeService = afterlifeService;
    this.dinosaurFactory = dinosaurFactory;
  }

  /**
   * Retourne la liste des actions disponibles pour le dinosaure,
   * chaque action étant encapsulée dans un DinosaurActionDTO.
   * @param dinosaur Le dinosaure concerné.
   * @returns La liste des actions disponibles.
   */
  public getAvailableActions(dinosaur: FrontendDinosaurDTO): DinosaurActionDTO[] {
    return Object.values(DinosaurActionsMap).map((actionDetails) => {
      const canPerform = actionDetails.canPerform(dinosaur);
      return new DinosaurActionDTO(
        actionDetails.name,
        actionDetails.description,
        actionDetails.levelRequired,
        canPerform,
        actionDetails.endpoint,
        actionDetails.image
      );
    });
  }

  /**
   * Sélectionne aléatoirement un événement pour une action donnée en utilisant le système dynamique.
   * Le repository dynamique est utilisé pour récupérer les templates,
   * filtrer ceux éligibles selon le niveau du dinosaure, et effectuer une sélection pondérée.
   * L'événement final est généré via la classe DynamicEvent.
   * 
   * @param action L'action effectuée.
   * @param dinosaurLevel Le niveau du dinosaure.
   * @returns Une promesse résolvant l'événement dynamique généré.
   */
  public async getRandomEventForAction(
    action: DinosaurAction,
    dinosaurLevel: number
  ): Promise<DinosaurEvent> {
    // Récupérer tous les templates dynamiques pour l'action donnée
    const dynamicEventsData = await this.dynamicEventRepo.getDynamicEventsByAction(action);
    // Filtrer ceux dont le niveau minimum est inférieur ou égal au niveau du dinosaure
    const eligibleTemplates = dynamicEventsData.filter(eventData => eventData.minLevel <= dinosaurLevel);
    if (eligibleTemplates.length === 0) {
      throw new Error(`Aucun event dynamique disponible pour l'action ${action} et le niveau ${dinosaurLevel}`);
    }
    // Sélection pondérée selon le champ weight
    const totalWeight = eligibleTemplates.reduce((sum, eventData) => sum + eventData.weight, 0);
    let randomWeight = Math.random() * totalWeight;
    let chosenTemplate = eligibleTemplates[eligibleTemplates.length - 1];
    for (const eventData of eligibleTemplates) {
      if (randomWeight < eventData.weight) {
        chosenTemplate = eventData;
        break;
      }
      randomWeight -= eventData.weight;
    }
    // Générer l'événement final à partir du template choisi
    const dynamicEvent = new DynamicEvent(chosenTemplate);
    return dynamicEvent.generateEvent(dinosaurLevel);
  }

  /**
   * Applique les effets d'un événement au dinosaure en utilisant les modifiers définis dans l'événement.
   * Pour l'action "Resurrect", la méthode :
   * - Enregistre l'historique de vie via l'AfterlifeService,
   * - Délègue la résurrection à la DinosaurFactory.
   * 
   * Pour les autres actions, chaque modifier est appliqué sur la propriété correspondante du dinosaure :
   * - 'additive' : la valeur est ajoutée.
   * - 'multiplicative' : la valeur multiplie la valeur courante.
   * 
   * Une table de correspondance (targetMapping) permet de faire le lien entre le target du modifier et la propriété du DTO.
   * 
   * Après application des modifiers, la méthode gère la montée de niveau et l'ajout des skill points.
   * 
   * @param dinosaur Le DTO du dinosaure à mettre à jour.
   * @param action L'action effectuée.
   * @param event L'événement à appliquer.
   * @returns Une promesse résolvant le dinosaure mis à jour.
   */
  public async applyEventToDinosaur(
    dinosaur: FrontendDinosaurDTO,
    action: DinosaurAction,
    event: DinosaurEvent
  ): Promise<FrontendDinosaurDTO> {
    if (action === DinosaurAction.Resurrect) {
      // Enregistrer l'historique de vie avant résurrection
      await this.afterlifeService.processAfterlife(dinosaur);
      // Utiliser la factory injectée pour ressusciter le dinosaure
      return await this.dinosaurFactory.resurrectDinosaur(dinosaur);
    }

    // Table de correspondance entre le target du modifier et la propriété du DTO
    const targetMapping = {
      energy: "energy",
      food: "food",
      hunger: "hunger",
      experience: "experience",
      karma: "karma",
      money: "money",
      skillPoints: "skill_points",
      weapons: "weapons",
      armors: "armors",
      friends: "friends",
      employees: "employees"
    } as const;

    // Appliquer chaque modifier de l'événement
    for (const modifier of event.modifiers) {
      const targetProperty = targetMapping[modifier.target];
      if (!targetProperty) {
        continue;
      }
      // Accéder à la propriété du dinosaure
      const dinosaurRecord = dinosaur as Record<string, any>;
      const currentValue = dinosaurRecord[targetProperty] as number;
      console.log(`Valeur actuelle de ${targetProperty} : ${currentValue}`);
      let newValue = currentValue;
      if (modifier.type === 'additive') {
        newValue = currentValue + modifier.value;
      } else if (modifier.type === 'multiplicative') {
        newValue = currentValue * modifier.value;
      }
      dinosaurRecord[targetProperty] = newValue;
    }

    // Gestion de la montée de niveau et gain de skill points
    let experienceThreshold = getExperienceThresholdForLevel(dinosaur.level + 1);
    while (dinosaur.experience >= experienceThreshold) {
      dinosaur.level += 1;
      dinosaur.experience -= experienceThreshold;
      dinosaur.skill_points += getSkillPointsForLevel(dinosaur.level);
      experienceThreshold = getExperienceThresholdForLevel(dinosaur.level + 1);
    }

    // Plafonner certaines valeurs selon les bornes définies dans le DTO
    dinosaur.food = Math.min(dinosaur.food, dinosaur.final_max_food);
    dinosaur.energy = Math.max(dinosaur.energy, 0);
    dinosaur.hunger = Math.max(dinosaur.hunger, 0);
    dinosaur.karma = Math.max(-dinosaur.karma_width, Math.min(dinosaur.karma, dinosaur.karma_width));

    return dinosaur;
  }
}
