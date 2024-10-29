export interface DinosaurEvent {
    name: string;                // Nom de l'événement
    description: string;         // Description de l'événement
    energyChange: number;        // Variation de l'énergie
    foodChange: number;          // Variation de la nourriture
    hungerChange: number;        // Variation de la faim
    experienceChange: number;    // Variation de l'expérience
    minLevel: number,
    weight: number;              // Facteur de probabilité (poids)
  }