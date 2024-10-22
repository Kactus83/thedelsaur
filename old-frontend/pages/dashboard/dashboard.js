/**
 * Fonction principale appelée lorsque la page est chargée.
 * Elle gère l'affichage des informations utilisateur et dinosaure.
 */
async function initializePage() {
    console.log("Page loaded, starting initialization...");

    try {
        // Récupérer les informations de l'utilisateur et du dinosaure
        const user = await fetchUserFromBackend();
        const dinosaur = await fetchDinosaurFromBackend();

        // Afficher les informations utilisateur
        displayUserInfo(user);

        // Afficher les informations du dinosaure
        displayDinosaurInfo(dinosaur);
    } catch (error) {
        console.error("Erreur lors de l'initialisation de la page :", error);
    }

    console.log("Initialization completed.");
}

/**
 * Affiche les informations de l'utilisateur dans la div correspondante.
 */
function displayUserInfo(user) {
    const userInfoDiv = document.querySelector('.usersDisplay');
    const usernameSpan = document.getElementById('username');

    // Vérifier si les informations utilisateur sont présentes
    if (user) {
        console.log("Displaying user data:", user);
        // Remplir la div avec les informations utilisateur
        userInfoDiv.innerHTML = `
            <h3>Utilisateur :</h3>
            <p>Nom d'utilisateur : ${user.username}</p>
        `;
        // Mettre à jour le span du nom d'utilisateur
        usernameSpan.textContent = user.username;
    } else {
        console.log("No user data found.");
        // Si aucune information utilisateur n'est trouvée, afficher un message d'erreur
        userInfoDiv.innerHTML = '<p>Aucun utilisateur trouvé.</p>';
    }
}

/**
 * Affiche les informations du dinosaure dans la div correspondante et met à jour l'image du dinosaure.
 */
function displayDinosaurInfo(dinosaur) {
    const dinoInfoDiv = document.querySelector('.dino-infos');

    // Vérifier si les informations dinosaure sont présentes
    if (dinosaur) {
        renderDinosaurStats(dinosaur);
        
    } else {
        console.log("No dinosaur data found.");
        // Si aucune information dinosaure n'est trouvée, afficher un message d'erreur
        dinoInfoDiv.innerHTML = '<p>Aucun dinosaure trouvé.</p>';

        // Mettre à jour l'overlay dino-infos en mode mobile
        const overlayDinoInfoDiv = document.querySelector('.dino-infos-overlay');
        if (overlayDinoInfoDiv) {
            overlayDinoInfoDiv.innerHTML = '<p>Aucun dinosaure trouvé.</p>';
        }
    }
}

/**
 * Initialise et gère le système d'overlay pour le mode mobile.
 */
function setupOverlay() {
    const openBtn = document.getElementById('openDinoStats');
    const closeBtn = document.getElementById('closeDinoOverlay');
    const overlay = document.getElementById('dinoOverlay');

    console.log("Setting up overlay:", { openBtn, closeBtn, overlay });

    // Fonction pour ouvrir l'overlay
    function openOverlay() {
        console.log("Opening overlay");
        overlay.classList.add('active');
    }

    // Fonction pour fermer l'overlay
    function closeOverlayFunc() {
        console.log("Closing overlay");
        overlay.classList.remove('active');
    }

    // Vérifier si les éléments existent avant d'ajouter les écouteurs
    if (openBtn && closeBtn && overlay) {
        openBtn.addEventListener('click', openOverlay);
        closeBtn.addEventListener('click', closeOverlayFunc);

        // Fermer l'overlay en cliquant en dehors du contenu
        overlay.addEventListener('click', (event) => {
            if (event.target === overlay) {
                console.log("Clicked outside overlay content, closing overlay");
                closeOverlayFunc();
            }
        });

        console.log("Overlay event listeners attached successfully.");
    } else {
        console.error("Les éléments de l'overlay ne sont pas correctement définis:", { openBtn, closeBtn, overlay });
    }
}



/**
 * Lie les boutons aux actions du dinosaure.
 */
function setupDinosaurActions() {
    const eatButton = document.getElementById('eatButton');
    const sleepButton = document.getElementById('sleepButton');
    const wakeButton = document.getElementById('wakeButton');
    const resurrectButton = document.getElementById('resurrectButton');

    if (eatButton) {
        eatButton.addEventListener('click', eatDinosaur);
    }

    if (sleepButton) {
        sleepButton.addEventListener('click', sleepDinosaur);
    }

    if (wakeButton) {
        wakeButton.addEventListener('click', wakeDinosaur);
    }

    if (resurrectButton) {
        resurrectButton.addEventListener('click', resurrectDinosaur);
    }
}

// Lancer l'initialisation de la page et configurer l'overlay lorsque le DOM est chargé
document.addEventListener('DOMContentLoaded', () => {
    initializePage();
    setupOverlay();
    setupDinosaurActions();
});