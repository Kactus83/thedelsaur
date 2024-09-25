// Fonction pour récupérer et afficher tous les utilisateurs
async function fetchUsers() {
    try {
        const response = await fetch('http://localhost:3000/admin/users', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const users = await response.json();
            renderUsers(users);
        } else {
            console.error('Erreur lors de la récupération des utilisateurs.');
            alert('Erreur lors de la récupération des utilisateurs.');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la récupération des utilisateurs.');
    }
}

// Fonction pour afficher les utilisateurs dans le tableau
function renderUsers(users) {
    const tbody = document.querySelector('#user-table tbody');
    tbody.innerHTML = ''; // Efface le tableau avant de le re-remplir

    users.forEach(user => {
        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${new Date(user.created_at).toLocaleDateString()}</td>
            <td>
                <button class="action-btn delete" onclick="deleteUser(${user.id})">Supprimer</button>
                <button class="action-btn update" onclick="updateUser(${user.id})">Modifier</button>
                <button class="action-btn view-dino" onclick="viewDinosaur(${user.id})">Voir Dinosaure</button>
            </td>
        `;

        tbody.appendChild(row);
    });
}

// Fonction pour supprimer un utilisateur
async function deleteUser(userId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    try {
        const response = await fetch(`http://localhost:3000/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            alert('Utilisateur supprimé avec succès');
            fetchUsers(); // Rafraîchir la liste des utilisateurs
        } else {
            const errorData = await response.json();
            alert(`Erreur lors de la suppression de l'utilisateur: ${errorData.message}`);
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la suppression de l\'utilisateur.');
    }
}

// Fonction pour mettre à jour un utilisateur (espace réservé)
function updateUser(userId) {
    alert(`Fonction de mise à jour de l'utilisateur avec ID ${userId} non encore implémentée.`);
}

// Fonction pour voir le dinosaure d'un utilisateur
async function viewDinosaur(userId) {
    try {
        const response = await fetch(`http://localhost:3000/admin/dinosaurs`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            const dinosaurs = await response.json();
            const dinosaur = dinosaurs.find(dino => dino.user_id === userId);
            if (dinosaur) {
                showDinosaurModal(dinosaur);
            } else {
                alert('Aucun dinosaure trouvé pour cet utilisateur.');
            }
        } else {
            console.error('Erreur lors de la récupération des dinosaures.');
            alert('Erreur lors de la récupération des dinosaures.');
        }
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors de la récupération des dinosaures.');
    }
}

// Fonction pour afficher le dinosaure dans une modal
function showDinosaurModal(dinosaur) {
    const modal = document.getElementById('dino-modal');
    const modalContent = document.getElementById('dino-modal-content');

    modalContent.innerHTML = `
        <span class="close" onclick="closeDinosaurModal()">&times;</span>
        <h2>Détails du Dinosaure</h2>
        <p><strong>ID:</strong> ${dinosaur.id}</p>
        <p><strong>Nom:</strong> ${dinosaur.name}</p>
        <p><strong>Régime Alimentaire:</strong> ${capitalizeFirstLetter(dinosaur.diet)}</p>
        <p><strong>Énergie:</strong> ${dinosaur.energy}</p>
        <p><strong>Nourriture:</strong> ${dinosaur.food}</p>
        <p><strong>Expérience:</strong> ${dinosaur.experience}</p>
        <p><strong>Epoch:</strong> ${capitalizeFirstLetter(dinosaur.epoch)}</p>
        <p><strong>Date de création:</strong> ${new Date(dinosaur.created_at).toLocaleDateString()}</p>
    `;

    modal.style.display = 'block';
}

// Fonction pour fermer la modal
function closeDinosaurModal() {
    const modal = document.getElementById('dino-modal');
    modal.style.display = 'none';
}

// Fonction pour capitaliser la première lettre
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

// Fermer la modal si l'utilisateur clique en dehors de la modal
window.onclick = function(event) {
    const modal = document.getElementById('dino-modal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Charger les utilisateurs au chargement de la page
window.onload = fetchUsers;