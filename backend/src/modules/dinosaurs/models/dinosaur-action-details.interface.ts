import { Dinosaur } from '../models/dinosaur.interface';

export interface DinosaurActionDetails {
  name: string;
  description: string;
  canPerform: (dinosaur: Dinosaur) => boolean; // Fonction pour vérifier si l'action peut être effectuée
  endpoint: string; // URL de l'endpoint pour l'action
  image: string; // Chemin de l'image associée à l'action
}