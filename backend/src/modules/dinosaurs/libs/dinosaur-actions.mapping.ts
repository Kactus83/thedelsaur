import { DinosaurAction } from '../models/dinosaur-action.enum';
import { DinosaurActionDetails } from '../models/dinosaur-action-details.interface';
import {
  ENERGY_COST_TO_DISCOVER,
  ENERGY_COST_TO_GRAZE,
  ENERGY_COST_TO_HUNT,
  ENERGY_COST_TO_PRAY,
  ENERGY_COST_TO_STEAL,
} from '../../../common/config/actions.constants';
import { FrontendDinosaurDTO } from '../models/frontend-dinosaur.dto';

type DinosaurActionsMapType = {
  [key in DinosaurAction]: DinosaurActionDetails;
};

export const DinosaurActionsMap: DinosaurActionsMapType = {
  [DinosaurAction.Eat]: {
    levelRequired: 1,
    name: 'Manger',
    description: 'Le dinosaure mange pour récupérer de la nourriture.',
    canPerform: (dinosaur: FrontendDinosaurDTO) => {
      return (
        dinosaur.level >= 1 &&
        !dinosaur.is_dead &&
        !dinosaur.is_sleeping &&
        dinosaur.food > 0 &&
        dinosaur.hunger > 0
      );
    },
    endpoint: 'dinosaurs/actions/eat',
    image: '/assets/img/actions/eat.png',
  },
  [DinosaurAction.Sleep]: {
    levelRequired: 1,
    name: 'Dormir',
    description: 'Le dinosaure se met en sommeil pour récupérer de l\'énergie.',
    canPerform: (dinosaur: FrontendDinosaurDTO) => {
      return (
        dinosaur.level >= 1 &&
        !dinosaur.is_dead &&
        !dinosaur.is_sleeping &&
        dinosaur.energy <= dinosaur.base_max_energy / 4
      );
    },
    endpoint: 'dinosaurs/actions/sleep',
    image: '/assets/img/actions/sleep.png',
  },
  [DinosaurAction.WakeUp]: {
    levelRequired: 1,
    name: 'Se Réveiller',
    description: 'Le dinosaure se réveille après avoir dormi.',
    canPerform: (dinosaur: FrontendDinosaurDTO) => {
      return (
        dinosaur.level >= 1 &&
        !dinosaur.is_dead &&
        dinosaur.is_sleeping
      );
    },
    endpoint: 'dinosaurs/actions/wake',
    image: '/assets/img/actions/wake.png',
  },
  [DinosaurAction.Resurrect]: {
    levelRequired: 1,
    name: 'Ressusciter',
    description: 'Le dinosaure est ressuscité après sa mort.',
    canPerform: (dinosaur: FrontendDinosaurDTO) => {
      return dinosaur.is_dead;
    },
    endpoint: 'dinosaurs/actions/resurrect',
    image: '/assets/img/actions/resurrect.png',
  },
  [DinosaurAction.Graze]: {
    levelRequired: 1,
    name: 'Cueillir',
    description: 'Le dinosaure cueille des plantes pour récupérer de la nourriture.',
    canPerform: (dinosaur: FrontendDinosaurDTO) => {
      return (
        dinosaur.level >= 1 &&
        !dinosaur.is_dead &&
        !dinosaur.is_sleeping &&
        dinosaur.energy >= ENERGY_COST_TO_GRAZE &&
        dinosaur.diet.name !== 'carnivore'
      );
    },
    endpoint: 'dinosaurs/actions/graze',
    image: '/assets/img/actions/graze.png',
  },
  [DinosaurAction.Hunt]: {
    levelRequired: 1,
    name: 'Chasser',
    description: 'Le dinosaure chasse pour obtenir de la nourriture.',
    canPerform: (dinosaur: FrontendDinosaurDTO) => {
      return (
        dinosaur.level >= 1 &&
        !dinosaur.is_dead &&
        !dinosaur.is_sleeping &&
        dinosaur.energy >= ENERGY_COST_TO_HUNT &&
        dinosaur.diet.name !== 'herbivore'
      );
    },
    endpoint: 'dinosaurs/actions/hunt',
    image: '/assets/img/actions/hunt.png',
  },
  [DinosaurAction.Discover]: {
    levelRequired: 2,
    name: 'Découvrir',
    description: 'Le dinosaure découvre de nouvelles choses.',
    canPerform: (dinosaur: FrontendDinosaurDTO) => {
      return (
        dinosaur.level >= 2 &&
        !dinosaur.is_dead &&
        !dinosaur.is_sleeping &&
        dinosaur.energy >= ENERGY_COST_TO_DISCOVER
      );
    },
    endpoint: 'dinosaurs/actions/discover',
    image: '/assets/img/actions/discover.png',
  },
  [DinosaurAction.Steal]: {
    levelRequired: 4,
    name: 'Voler',
    description: 'Le dinosaure vole des ressources à un autre dinosaure.',
    canPerform: (dinosaur: FrontendDinosaurDTO) => {
      return (
        dinosaur.level >= 4 &&
        !dinosaur.is_dead &&
        !dinosaur.is_sleeping &&
        dinosaur.energy >= ENERGY_COST_TO_STEAL
      );
    },
    endpoint: 'dinosaurs/actions/steal',
    image: '/assets/img/actions/steal.png',
  },
  [DinosaurAction.Pray]: {
    levelRequired: 5,
    name: 'Prier',
    description: 'Le dinosaure prie pour remonter son karma.',
    canPerform: (dinosaur: FrontendDinosaurDTO) => {
      return dinosaur.level >= 5 && !dinosaur.is_dead && !dinosaur.is_sleeping && dinosaur.energy >= ENERGY_COST_TO_PRAY;
    },
    endpoint: 'dinosaurs/actions/pray',
    image: '/assets/img/actions/pray.png',
  },
};