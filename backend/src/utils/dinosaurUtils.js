// Liste de prénoms possibles pour les dinosaures
const names = [
    'Rex', 'Bella', 'Spike', 'Tina', 'Dino', 'Luna',
    'Thor', 'Milo', 'Zara', 'Rocky', 'Sasha', 'Leo',
    'Nina', 'Gus', 'Ruby', 'Max', 'Maya', 'Oscar'
  ];
  
  // Liste des régimes alimentaires possibles
  const diets = ['herbivore', 'carnivore', 'omnivore'];
  
  // Liste des époques possibles
  const epochs = ['past', 'present', 'future'];
  
  // Fonction pour générer un nom aléatoire
  exports.generateRandomName = () => {
    const randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
  };
  
  // Fonction pour obtenir un régime alimentaire aléatoire
  exports.getRandomDiet = () => {
    const randomIndex = Math.floor(Math.random() * diets.length);
    return diets[randomIndex];
  };
  
  // Fonction pour obtenir une époque spécifique (par défaut 'past')
  exports.getInitialEpoch = () => {
    return 'past';
  };