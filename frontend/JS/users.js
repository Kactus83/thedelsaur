// Fonction pour récupérer et afficher tous les utilisateurs
async function fetchUsers() {
    try {
        const response = await fetch('http://localhost:3000/users', {
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
        }
    } catch (error) {
        console.error('Erreur:', error);
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
            </td>
        `;

        tbody.appendChild(row);
    });
}

// Fonction pour supprimer un utilisateur
async function deleteUser(userId) {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;

    try {
        const response = await fetch(`http://localhost:3000/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        if (response.ok) {
            alert('Utilisateur supprimé avec succès');
            fetchUsers(); // Rafraîchir la liste des utilisateurs
        } else {
            alert('Erreur lors de la suppression de l\'utilisateur');
        }
    } catch (error) {
        console.error('Erreur:', error);
    }
}

// Fonction pour mettre à jour un utilisateur (espace réservé)
function updateUser(userId) {
    alert(`Fonction de mise à jour de l'utilisateur avec ID ${userId} non encore implémentée.`);
}

// Charger les utilisateurs au chargement de la page
window.onload = fetchUsers;
