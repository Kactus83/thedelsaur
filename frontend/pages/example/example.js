/**
 * Fonction principale appelée lorsque la page est chargée.
 * Elle gère l'affichage des informations utilisateur et dinosaure.
 */
async function initializePage() {
    console.log("Page loaded, starting initialization...");

    // Récupérer les informations de l'utilisateur et du dinosaure
    // Grace aux fonctions du fichier sessionHandlerAndDataRetriever.js
    const user = await fetchUserFromBackend();
    const dinosaur = await fetchDinosaurFromBackend();

    // Afficher les informations utilisateur
    displayUserInfo(user);

    // Afficher les informations du dinosaure
    displayDinosaurInfo(dinosaur);

    console.log("Initialization completed.");
}

/**
 * Affiche les informations de l'utilisateur dans la div correspondante.
 */
function displayUserInfo(user) {
    const userInfoDiv = document.getElementById('user-info');

    // Vérifier si les informations utilisateur sont présentes
    if (user) {
        console.log("Displaying user data:", user);
        // Remplir la div avec les informations utilisateur
        userInfoDiv.innerHTML = `
            <h3>Utilisateur :</h3>
            <p>Nom d'utilisateur : ${user.username}</p>
            <p>Email : ${user.email}</p>
        `;
    } else {
        console.log("No user data found.");
        // Si aucune information utilisateur n'est trouvée, afficher un message d'erreur
        userInfoDiv.innerHTML = '<p>Aucun utilisateur trouvé.</p>';
    }
}

/**
 * Affiche les informations du dinosaure dans la div correspondante.
 */
function displayDinosaurInfo(dinosaur) {
    const dinoInfoDiv = document.getElementById('dino-info');

    // Vérifier si les informations dinosaure sont présentes
    if (dinosaur) {
        console.log("Displaying dinosaur data:", dinosaur);
        // Remplir la div avec les informations du dinosaure
        dinoInfoDiv.innerHTML = `
            <h3>Dinosaure :</h3>
            <p>Nom : ${dinosaur.name}</p>
            <p>Régime alimentaire : ${dinosaur.diet}</p>
            <p>Énergie : ${dinosaur.energy}</p>
            <p>Époque : ${dinosaur.epoch}</p>
        `;
    } else {
        console.log("No dinosaur data found.");
        // Si aucune information dinosaure n'est trouvée, afficher un message d'erreur
        dinoInfoDiv.innerHTML = '<p>Aucun dinosaure trouvé.</p>';
    }
}

// Lancer l'initialisation de la page lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', initializePage);