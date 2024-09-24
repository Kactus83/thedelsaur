// Liste de noms possibles pour les dinosaures
const names = [
    'Rex', 'Bella', 'Spike', 'Tina', 'Dino', 'Luna',
    'Thor', 'Milo', 'Zara', 'Rocky', 'Sasha', 'Leo',
    'Nina', 'Gus', 'Ruby', 'Max', 'Maya', 'Oscar'
  ];
  
  // Liste des régimes alimentaires possibles
  const diets = ['herbivore', 'carnivore', 'omnivore'];
  
  /**
   * Génère un nom aléatoire pour un dinosaure.
   * @returns {string} Un nom aléatoire.
   */
  const generateRandomName = () => {
    const randomIndex = Math.floor(Math.random() * names.length);
    return names[randomIndex];
  };
  
  /**
   * Sélectionne un régime alimentaire aléatoire.
   * @returns {string} Un régime alimentaire aléatoire.
   */
  const getRandomDiet = () => {
    const randomIndex = Math.floor(Math.random() * diets.length);
    return diets[randomIndex];
  };
  
  module.exports = {
    generateRandomName,
    getRandomDiet
  };