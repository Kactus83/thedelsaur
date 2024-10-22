/**
 * Met à jour les données du dinosaure dans le localStorage et l'interface utilisateur.
 * @param {Object} dinosaur - Les données du dinosaure.
 */
function renderDinosaurStats(dinosaur) {
    // Définition des constantes directement dans la fonction ( a copier depuis le backend en cas de bug)
    const BASE_FOOD = 10000;
    const BASE_ENERGY = 10000;
    const FOOD_DECAY_RATE_PER_SECOND = 5; 
    const ENERGY_COST_TO_EAT = 1000;
    const ENERGY_DECAY_RATE_PER_SECOND = 5; 
    const ENERGY_RECOVERY_RATE_PER_SECOND = 10;
    const MIN_FOOD_PER_MEAL = 500;
    const MAX_FOOD_PER_MEAL = 1000;
    const MAX_ENERGY_NO_SLEEP = 2500;
    const MIN_ENERGY_TO_WAKE_UP = 7500;

    // Mise à jour des éléments principaux
    const middleContentDiv = document.querySelector('.middleContent');
    const dinoImage = middleContentDiv.querySelector('img.dino-svg');
    
    const nameElement = document.getElementById('name');
    const dietElement = document.getElementById('diet');
    const energyElement = document.getElementById('energy');
    const maxEnergyElement = document.getElementById('max_energy');
    const foodElement = document.getElementById('food');
    const maxFoodElement = document.getElementById('max_food');
    const experienceElement = document.getElementById('experience');
    const epochElement = document.getElementById('epoch');
    const createdAtElement = document.getElementById('created_at');
    const lastUpdateElement = document.getElementById('last_update_by_time_service');
    const isSleepingElement = document.getElementById('isSleeping');
    const isDeadElement = document.getElementById('isDead');

    if (
        nameElement && dietElement && energyElement && maxEnergyElement &&
        foodElement && maxFoodElement && experienceElement && epochElement &&
        createdAtElement && lastUpdateElement && isSleepingElement && isDeadElement
    ) {
        nameElement.textContent = dinosaur.name;
        dietElement.textContent = dinosaur.diet;
        energyElement.textContent = dinosaur.energy;
        maxEnergyElement.textContent = dinosaur.max_energy;
        foodElement.textContent = dinosaur.food;
        maxFoodElement.textContent = dinosaur.max_food;
        experienceElement.textContent = dinosaur.experience;
        epochElement.textContent = dinosaur.epoch;
        createdAtElement.textContent = new Date(dinosaur.created_at).toLocaleDateString();
        lastUpdateElement.textContent = new Date(dinosaur.last_update_by_time_service).toLocaleDateString();
        isSleepingElement.textContent = dinosaur.isSleeping ? 'Oui' : 'Non';
        isDeadElement.textContent = dinosaur.isDead ? 'Oui' : 'Non';
    } else {
        console.warn("Certains éléments DOM pour les statistiques du dinosaure sont manquants.");
    }

    
    const o_nameElement = document.getElementById('o_name');
    const o_dietElement = document.getElementById('o_diet');
    const o_energyElement = document.getElementById('o_energy');
    const o_maxEnergyElement = document.getElementById('o_max_energy');
    const o_foodElement = document.getElementById('o_food');
    const o_maxFoodElement = document.getElementById('o_max_food');
    const o_experienceElement = document.getElementById('o_experience');
    const o_epochElement = document.getElementById('o_epoch');
    const o_createdAtElement = document.getElementById('o_created_at');
    const o_lastUpdateElement = document.getElementById('o_last_update_by_time_service');
    const o_isSleepingElement = document.getElementById('o_isSleeping');
    const o_isDeadElement = document.getElementById('o_isDead');

    if (
        o_nameElement && o_dietElement && o_energyElement && o_maxEnergyElement &&
        o_foodElement && o_maxFoodElement && o_experienceElement && o_epochElement &&
        o_createdAtElement && o_lastUpdateElement && o_isSleepingElement && o_isDeadElement
    ) {
        o_nameElement.textContent = dinosaur.name;
        o_dietElement.textContent = dinosaur.diet;
        o_energyElement.textContent = dinosaur.energy;
        o_maxEnergyElement.textContent = dinosaur.max_energy;
        o_foodElement.textContent = dinosaur.food;
        o_maxFoodElement.textContent = dinosaur.max_food;
        o_experienceElement.textContent = dinosaur.experience;
        o_epochElement.textContent = dinosaur.epoch;
        o_createdAtElement.textContent = new Date(dinosaur.created_at).toLocaleDateString();
        o_lastUpdateElement.textContent = new Date(dinosaur.last_update_by_time_service).toLocaleDateString();
        o_isSleepingElement.textContent = dinosaur.isSleeping ? 'Oui' : 'Non';
        o_isDeadElement.textContent = dinosaur.isDead ? 'Oui' : 'Non';
    } else {
        console.warn("Certains éléments DOM pour les statistiques du dinosaure en mobile sont manquants.");
    }

    // Mettre à jour l'image SVG du dinosaure
    if (dinoImage) {
        dinoImage.src = `../../assets/dino/dino_${dinosaur.diet}.svg`; // Ex: dino_herbivore.svg
        dinoImage.alt = `Image de ${dinosaur.name}`;
    } else {
        // Si l'image n'existe pas, la créer et l'ajouter
        const newDinoImage = document.createElement('img');
        newDinoImage.src = `../../assets/dino/dino_${dinosaur.diet}.svg`; // Ex: dino_herbivore.svg
        newDinoImage.alt = `Image de ${dinosaur.name}`;
        newDinoImage.classList.add('dino-svg');
        middleContentDiv.appendChild(newDinoImage);
    }

    // Gestion des boutons d'actions
    const eatButton = document.getElementById('eatButton');
    const sleepButton = document.getElementById('sleepButton');
    const wakeButton = document.getElementById('wakeButton');
    const resurrectButton = document.getElementById('resurrectButton');

    if (eatButton) {
        // Le bouton "Manger" est désactivé si le dinosaure est mort, en sommeil, ou si la nourriture est insuffisante
        eatButton.disabled = dinosaur.isDead || dinosaur.isSleeping || dinosaur.food <= MIN_FOOD_PER_MEAL;
    }
    if (sleepButton) {
        // Le bouton "Se Mettre en Sommeil" est désactivé si le dinosaure est mort, déjà en sommeil, ou si l'énergie est trop élevée
        sleepButton.disabled = dinosaur.isDead || dinosaur.isSleeping || dinosaur.energy > MAX_ENERGY_NO_SLEEP;
    }
    if (wakeButton) {
        // Le bouton "Se Réveiller" est désactivé si le dinosaure est mort, pas en sommeil, ou si l'énergie est insuffisante
        wakeButton.disabled = dinosaur.isDead || !dinosaur.isSleeping || dinosaur.energy < MIN_ENERGY_TO_WAKE_UP;
    }
    if (resurrectButton) {
        // Le bouton "Ressusciter" est désactivé si le dinosaure n'est pas mort
        resurrectButton.disabled = !dinosaur.isDead;
    }
}

/**
 * Met à jour les données du dinosaure dans le localStorage.
 * @param {Object} dinosaur - Les données du dinosaure.
 */
function updateDinosaurInLocalStorage(dinosaur) {
    localStorage.setItem('dinosaur', JSON.stringify(dinosaur));
    // Optionnel : Mettre à jour l'interface utilisateur ici
    renderDinosaurStats(dinosaur);
}

/**
 * Action : Manger
 * Permet au dinosaure de manger.
 */
async function eatDinosaur() {
    try {
        const response = await axios.post('http://localhost:3000/dinosaurs/actions/eat');
        const updatedDinosaur = response.data.dinosaur;
        updateDinosaurInLocalStorage(updatedDinosaur);
        alert('Le dinosaure a mangé avec succès !');
    } catch (error) {
        console.error('Erreur lors de l\'action manger du dinosaure:', error);
        alert(`Erreur: ${error.response?.data?.message || 'Erreur interne du serveur.'}`);
    }
}

/**
 * Action : Se Mettre en Sommeil
 * Permet au dinosaure de se mettre en sommeil.
 */
async function sleepDinosaur() {
    try {
        const response = await axios.post('http://localhost:3000/dinosaurs/actions/sleep');
        const updatedDinosaur = response.data.dinosaur;
        updateDinosaurInLocalStorage(updatedDinosaur);
        alert('Le dinosaure est maintenant en sommeil.');
    } catch (error) {
        console.error('Erreur lors de l\'action dormir du dinosaure:', error);
        alert(`Erreur: ${error.response?.data?.message || 'Erreur interne du serveur.'}`);
    }
}

/**
 * Action : Se Réveiller
 * Permet au dinosaure de se réveiller.
 */
async function wakeDinosaur() {
    try {
        const response = await axios.post('http://localhost:3000/dinosaurs/actions/wake');
        const updatedDinosaur = response.data.dinosaur;
        updateDinosaurInLocalStorage(updatedDinosaur);
        alert('Le dinosaure s\'est réveillé.');
    } catch (error) {
        console.error('Erreur lors de l\'action réveiller du dinosaure:', error);
        alert(`Erreur: ${error.response?.data?.message || 'Erreur interne du serveur.'}`);
    }
}

/**
 * Action : Ressusciter
 * Permet de ressusciter un dinosaure mort.
 */
async function resurrectDinosaur() {
    try {
        const response = await axios.post('http://localhost:3000/dinosaurs/actions/resurrect');
        const updatedDinosaur = response.data.dinosaur;
        updateDinosaurInLocalStorage(updatedDinosaur);
        alert('Le dinosaure a été ressuscité.');
    } catch (error) {
        console.error('Erreur lors de l\'action ressusciter du dinosaure:', error);
        alert(`Erreur: ${error.response?.data?.message || 'Erreur interne du serveur.'}`);
    }
}