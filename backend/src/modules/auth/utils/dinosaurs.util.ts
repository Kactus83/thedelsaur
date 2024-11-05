import { DietType } from "../../dinosaurs/models/dinosaur-diet.type";
import { DinosaurType } from "../../dinosaurs/models/dinosaur-type.type";

// Liste de prénoms possibles pour les dinosaures
const names: string[] = [
    'Rex', 'Bella', 'Spike', 'Tina', 'Dino', 'Luna',
    'Thor', 'Milo', 'Zara', 'Rocky', 'Sasha', 'Leo',
    'Nina', 'Gus', 'Ruby', 'Max', 'Maya', 'Oscar'
];

// Liste des régimes alimentaires possibles
const diets: DietType[] = ['herbivore', 'carnivore', 'omnivore'];

// Liste des types de dinosaures possibles
const types: DinosaurType[] = ['land', 'air', 'sea'];

// Fonction pour générer un nom aléatoire
export const generateRandomName = (): string => {
    const randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
};

// Fonction pour obtenir un régime alimentaire aléatoire
export const getRandomDiet = (): DietType => {
    const randomIndex = Math.floor(Math.random() * diets.length);
    return diets[randomIndex];
};

// Fonction pour obtenir un type de dinosaure aléatoire
export const getRandomType = (): DinosaurType => {
    const randomIndex = Math.floor(Math.random() * types.length);
    return types[randomIndex];
};

// Fonction pour obtenir une époque spécifique (par défaut 'past')
export const getInitialEpoch = (): string => {
    return 'past';
};