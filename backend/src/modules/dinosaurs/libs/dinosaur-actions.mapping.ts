import { Dinosaur } from '../models/dinosaur.interface';
import { DinosaurAction } from '../models/dinosaur-action.enum';
import { canPerformAction } from '../utils/dinosaur-actions.util';
import { DinosaurActionDetails } from '../models/dinosaur-action-details.interface';

export const DinosaurActionsMap: Record<DinosaurAction, DinosaurActionDetails> = {
  [DinosaurAction.Eat]: {
    levelRequired: 1,
    name: 'Manger',
    description: 'Le dinosaure mange pour récupérer de la nourriture.',
    canPerform: (dinosaur: Dinosaur) => canPerformAction(dinosaur, DinosaurAction.Eat),
    endpoint: 'dinosaurs/actions/eat',
    image: '/assets/img/actions/eat.png',
  },
  [DinosaurAction.Sleep]: {
    levelRequired: 1,
    name: 'Dormir',
    description: 'Le dinosaure se met en sommeil pour récupérer de l\'énergie.',
    canPerform: (dinosaur: Dinosaur) => canPerformAction(dinosaur, DinosaurAction.Sleep),
    endpoint: 'dinosaurs/actions/sleep',
    image: '/assets/img/actions/sleep.png',
  },
  [DinosaurAction.WakeUp]: {
    levelRequired: 1,
    name: 'Se Réveiller',
    description: 'Le dinosaure se réveille après avoir dormi.',
    canPerform: (dinosaur: Dinosaur) => canPerformAction(dinosaur, DinosaurAction.WakeUp),
    endpoint: 'dinosaurs/actions/wake',
    image: '/assets/img/actions/wake.png',
  },
  [DinosaurAction.Resurrect]: {
    levelRequired: 1,
    name: 'Ressusciter',
    description: 'Le dinosaure est ressuscité après sa mort.',
    canPerform: (dinosaur: Dinosaur) => canPerformAction(dinosaur, DinosaurAction.Resurrect),
    endpoint: 'dinosaurs/actions/resurrect',
    image: '/assets/img/actions/resurrect.png',
  },
  [DinosaurAction.Graze]: {
    levelRequired: 1,
    name: 'Cueillir',
    description: 'Le dinosaure cueille des plantes pour récupérer de la nourriture.',
    canPerform: (dinosaur: Dinosaur) => canPerformAction(dinosaur, DinosaurAction.Graze),
    endpoint: 'dinosaurs/actions/graze',
    image: '/assets/img/actions/graze.png',
  },
  [DinosaurAction.Hunt]: {
    levelRequired: 1,
    name: 'Chasser',
    description: 'Le dinosaure chasse pour obtenir de la nourriture.',
    canPerform: (dinosaur: Dinosaur) => canPerformAction(dinosaur, DinosaurAction.Hunt),
    endpoint: 'dinosaurs/actions/hunt',
    image: '/assets/img/actions/hunt.png',
  },
  [DinosaurAction.Discover]: {
    levelRequired: 2,
    name: 'Découvrir',
    description: 'Le dinosaure découvre de nouvelles choses.',
    canPerform: (dinosaur: Dinosaur) => canPerformAction(dinosaur, DinosaurAction.Discover),
    endpoint: 'dinosaurs/actions/discover',
    image: '/assets/img/actions/discover.png',
  },
};
