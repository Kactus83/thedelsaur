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
 * Affiche les statistiques du dinosaure dans l'interface utilisateur.
 * @param {Object} dinosaur - Les données du dinosaure.
 */
function renderDinosaurStats(dinosaur) {
    // Exemple de mise à jour des éléments du DOM
    document.getElementById('food').textContent = dinosaur.food;
    document.getElementById('energy').textContent = dinosaur.energy;
    document.getElementById('isSleeping').textContent = dinosaur.isSleeping ? 'Oui' : 'Non';
    document.getElementById('isDead').textContent = dinosaur.isDead ? 'Oui' : 'Non';
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