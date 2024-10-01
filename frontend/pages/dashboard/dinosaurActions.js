/**
 * Met à jour les données du dinosaure dans le localStorage et l'interface utilisateur.
 * @param {Object} dinosaur - Les données du dinosaure.
 */
function renderDinosaurStats(dinosaur) {
    // Mise à jour des éléments principaux
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

    // Gestion des boutons d'actions
    const eatButton = document.getElementById('eatButton');
    const sleepButton = document.getElementById('sleepButton');
    const wakeButton = document.getElementById('wakeButton');
    const resurrectButton = document.getElementById('resurrectButton');

    if (eatButton) {
        eatButton.disabled = dinosaur.isDead || dinosaur.isSleeping;
    }
    if (sleepButton) {
        sleepButton.disabled = dinosaur.isDead || dinosaur.isSleeping === true || dinosaur.energy > MAX_ENERGY_NO_SLEEP;
    }
    if (wakeButton) {
        wakeButton.disabled = dinosaur.isDead || dinosaur.isSleeping === false || dinosaur.energy < MIN_ENERGY_TO_WAKE_UP;
    }
    if (resurrectButton) {
        resurrectButton.disabled = dinosaur.isDead === false;
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