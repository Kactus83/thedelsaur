import { FrontendDinosaurDTO } from "./frontend-dinosaur.dto";

export interface DinosaurActionDetails {
  name: string;
  description: string;
  levelRequired: number; // Niveau requis pour effectuer l'action
  canPerform: (dinosaur: FrontendDinosaurDTO) => boolean; // Fonction pour vérifier si l'action peut être effectuée
  endpoint: string; // URL de l'endpoint pour l'action
  image: string; // Chemin de l'image associée à l'action
}