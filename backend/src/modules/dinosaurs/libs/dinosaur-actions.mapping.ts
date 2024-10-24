import { Dinosaur } from '../models/dinosaur.interface';
import { DinosaurAction } from '../models/dinosaur-action.enum';
import { canPerformAction } from '../utils/dinosaur-actions.util';
import { DinosaurActionDetails } from '../models/dinosaur-action-details.interface';

export const DinosaurActionsMap: Record<DinosaurAction, DinosaurActionDetails> = {
  [DinosaurAction.Eat]: {
    name: 'Manger',
    description: 'Le dinosaure mange pour récupérer de la nourriture.',
    canPerform: (dinosaur: Dinosaur) => canPerformAction(dinosaur, DinosaurAction.Eat),
    endpoint: '/dinosaurs/actions/eat',
    image: '/assets/images/eat.png',
  },
  [DinosaurAction.Sleep]: {
    name: 'Dormir',
    description: 'Le dinosaure se met en sommeil pour récupérer de l\'énergie.',
    canPerform: (dinosaur: Dinosaur) => canPerformAction(dinosaur, DinosaurAction.Sleep),
    endpoint: '/dinosaurs/actions/sleep',
    image: '/assets/images/sleep.png',
  },
  [DinosaurAction.WakeUp]: {
    name: 'Se Réveiller',
    description: 'Le dinosaure se réveille après avoir dormi.',
    canPerform: (dinosaur: Dinosaur) => canPerformAction(dinosaur, DinosaurAction.WakeUp),
    endpoint: '/dinosaurs/actions/wake',
    image: '/assets/images/wake.png',
  },
  [DinosaurAction.Resurrect]: {
    name: 'Ressusciter',
    description: 'Le dinosaure est ressuscité après sa mort.',
    canPerform: (dinosaur: Dinosaur) => canPerformAction(dinosaur, DinosaurAction.Resurrect),
    endpoint: '/dinosaurs/actions/resurrect',
    image: '/assets/images/resurrect.png',
  },
  [DinosaurAction.Graze]: {
    name: 'Cueillir',
    description: 'Le dinosaure cueille des plantes pour récupérer de la nourriture.',
    canPerform: (dinosaur: Dinosaur) => canPerformAction(dinosaur, DinosaurAction.Graze),
    endpoint: '/dinosaurs/actions/graze',
    image: '/assets/images/graze.png',
  },
  [DinosaurAction.Hunt]: {
    name: 'Chasser',
    description: 'Le dinosaure chasse pour obtenir de la nourriture.',
    canPerform: (dinosaur: Dinosaur) => canPerformAction(dinosaur, DinosaurAction.Hunt),
    endpoint: '/dinosaurs/actions/hunt',
    image: '/assets/images/hunt.png',
  },
};
