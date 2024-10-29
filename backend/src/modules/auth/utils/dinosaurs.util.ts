// Liste de prénoms possibles pour les dinosaures
const names: string[] = [
    'Rex', 'Bella', 'Spike', 'Tina', 'Dino', 'Luna',
    'Thor', 'Milo', 'Zara', 'Rocky', 'Sasha', 'Leo',
    'Nina', 'Gus', 'Ruby', 'Max', 'Maya', 'Oscar'
];

// Liste des régimes alimentaires possibles
const diets: string[] = ['herbivore', 'carnivore', 'omnivore'];

// Liste des types de dinosaures possibles
const types: string[] = ['land', 'air', 'sea'];

// Fonction pour générer un nom aléatoire
export const generateRandomName = (): string => {
    const randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
};

// Fonction pour obtenir un régime alimentaire aléatoire
export const getRandomDiet = (): string => {
    const randomIndex = Math.floor(Math.random() * diets.length);
    return diets[randomIndex];
};

// Fonction pour obtenir un type de dinosaure aléatoire
export const getRandomType = (): string => {
    const randomIndex = Math.floor(Math.random() * types.length);
    return types[randomIndex];
};

// Fonction pour obtenir une époque spécifique (par défaut 'past')
export const getInitialEpoch = (): string => {
    return 'past';
};