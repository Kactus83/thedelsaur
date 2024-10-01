/**
 * Fonction principale appelée lorsque la page est chargée.
 * Elle gère l'affichage des informations utilisateur et dinosaure.
 */
async function initializePage() {
    console.log("Page loaded, starting initialization...");

    // Récupérer les informations de l'utilisateur et du dinosaure
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
    const userInfoDiv = document.querySelector('.usersDisplay');

    // Vérifier si les informations utilisateur sont présentes
    if (user) {
        console.log("Displaying user data:", user);
        // Remplir la div avec les informations utilisateur
        userInfoDiv.innerHTML = `
            <h3>Utilisateur :</h3>
            <p>Nom d'utilisateur : ${user.username}</p>
            <p>Email : ${user.email}</p>
            <p>Administrateur : ${user.isAdmin ? 'Oui' : 'Non'}</p>
            <p>Créé le : ${new Date(user.created_at).toLocaleDateString()}</p>
        `;
    } else {
        console.log("No user data found.");
        // Si aucune information utilisateur n'est trouvée, afficher un message d'erreur
        userInfoDiv.innerHTML = '<p>Aucun utilisateur trouvé.</p>';
    }
}

/**
 * Affiche les informations du dinosaure dans la div correspondante et insère le SVG du dinosaure.
 */
function displayDinosaurInfo(dinosaur) {
    const dinoInfoDiv = document.querySelector('.bottomLeft');

    // Vérifier si les informations dinosaure sont présentes
    if (dinosaur) {
        console.log("Displaying dinosaur data:", dinosaur);

        // Remplir la div avec les informations du dinosaure
        dinoInfoDiv.innerHTML = `
            <h3>Dinosaure : ${dinosaur.name}</h3>
            <p>Régime alimentaire : ${dinosaur.diet}</p>
            <p>Énergie : ${dinosaur.energy} / ${dinosaur.max_energy}</p>
            <p>Nourriture : ${dinosaur.food} / ${dinosaur.max_food}</p>
            <p>Expérience : ${dinosaur.experience}</p>
            <p>Époque : ${dinosaur.epoch}</p>
            <p>Créé le : ${new Date(dinosaur.created_at).toLocaleDateString()}</p>
            <p>Dernière mise à jour : ${new Date(dinosaur.last_update_by_time_service).toLocaleDateString()}</p>
        `;

        // Ajouter l'image SVG du dinosaure
        const dinoImage = document.createElement('img');
        dinoImage.src = `../../assets/dino/dino_${dinosaur.diet}.svg`; // Ex: dino_herbivore.svg
        dinoImage.alt = `Image de ${dinosaur.name}`;
        dinoImage.classList.add('dino-image');

        dinoInfoDiv.appendChild(dinoImage);
    } else {
        console.log("No dinosaur data found.");
        // Si aucune information dinosaure n'est trouvée, afficher un message d'erreur
        dinoInfoDiv.innerHTML = '<p>Aucun dinosaure trouvé.</p>';
    }
}

// Lancer l'initialisation de la page lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', initializePage);
