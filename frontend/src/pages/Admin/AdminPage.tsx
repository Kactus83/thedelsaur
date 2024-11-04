import React, { useEffect, useState } from 'react';
import Header from '../../components/Common/Header';
import Footer from '../../components/Common/Footer';
import './AdminPage.css';
import api from '../../services/api';
import { User } from '../../types/User';
import { Dinosaur } from '../../types/Dinosaur';

const AdminPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedDinosaur, setSelectedDinosaur] = useState<Dinosaur | null>(null);
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [levelsXp, setLevelsXp] = useState<{ level: number, xpRequired: number }[]>([]);

    const fetchUsers = async () => {
        try {
            const response = await api.get('/admin/users');
            setUsers(response.data as User[]);
        } catch (error: any) {
            console.error('Erreur lors de la récupération des utilisateurs.', error);
            alert('Erreur lors de la récupération des utilisateurs.');
        }
    };

    const fetchLevelsXp = async () => {
        try {
            const response = await api.get('/admin/levels-xp-table');
            setLevelsXp(response.data);
        } catch (error: any) {
            console.error('Erreur lors de la récupération des niveaux.', error);
            alert('Erreur lors de la récupération des niveaux.');
        }
    };

    const deleteUser = async (userId: number) => {
        if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) return;
        try {
            await api.delete(`/admin/users/${userId}`);
            alert('Utilisateur supprimé avec succès');
            fetchUsers();
        } catch (error: any) {
            console.error('Erreur lors de la suppression de l\'utilisateur:', error);
            alert(`Erreur lors de la suppression de l'utilisateur: ${error.response?.data?.message || 'Erreur interne.'}`);
        }
    };

    const viewDinosaur = async (userId: number) => {
        try {
            const response = await api.get('/admin/dinosaurs');
            const dinosaurs: Dinosaur[] = response.data;
            const dinosaur = dinosaurs.find((dino: any) => dino.user_id === userId);
            if (dinosaur) {
                setSelectedDinosaur(dinosaur);
                setIsModalOpen(true);
            } else {
                alert('Aucun dinosaure trouvé pour cet utilisateur.');
            }
        } catch (error: any) {
            console.error('Erreur lors de la récupération des dinosaures.', error);
            alert('Erreur lors de la récupération des dinosaures.');
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchLevelsXp();
    }, []);

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedDinosaur(null);
    };

    return (
        <>
            <Header />
            <div className="admin-page">
                <header>
                    <h1>Gestion des utilisateurs</h1>
                    <a href="/" className="back-btn">Retour à l'accueil</a>
                </header>

                <section id="user-management">
                    <table id="user-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Nom d'utilisateur</th>
                                <th>Email</th>
                                <th>Date de création</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>{user.username}</td>
                                    <td>{user.email}</td>
                                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                    <td>
                                        <button className="action-btn delete" onClick={() => deleteUser(user.id)}>Supprimer</button>
                                        <button className="action-btn update" onClick={() => alert(`Fonction de mise à jour de l'utilisateur avec ID ${user.id} non encore implémentée.`)}>Modifier</button>
                                        <button className="action-btn view-dino" onClick={() => viewDinosaur(user.id)}>Voir Dinosaure</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                <section id="level-xp-table">
                    <h2>Table des niveaux et paliers d'expérience</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Niveau</th>
                                <th>XP Requis</th>
                            </tr>
                        </thead>
                        <tbody>
                            {levelsXp.map(({ level, xpRequired }) => (
                                <tr key={level}>
                                    <td>{level}</td>
                                    <td>{xpRequired}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>

                {isModalOpen && selectedDinosaur && (
                    <div className="modal" onClick={closeModal}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <span className="close" onClick={closeModal}>&times;</span>
                            <h2>Détails du Dinosaure</h2>
                            <p><strong>ID:</strong> {selectedDinosaur.id}</p>
                            <p><strong>Nom:</strong> {selectedDinosaur.name}</p>
                            <p><strong>Régime Alimentaire:</strong> {capitalizeFirstLetter(selectedDinosaur.diet)}</p>
                            <p><strong>Énergie:</strong> {selectedDinosaur.energy}</p>
                            <p><strong>Nourriture:</strong> {selectedDinosaur.food}</p>
                            <p><strong>Expérience:</strong> {selectedDinosaur.experience}</p>
                            <p><strong>Epoch:</strong> {capitalizeFirstLetter(selectedDinosaur.epoch)}</p>
                            <p><strong>Date de création:</strong> {new Date(selectedDinosaur.created_at).toLocaleDateString()}</p>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export default AdminPage;
