import React, { useEffect, useState } from 'react';
// Importation des services pour récupérer les données utilisateur et dinosaure depuis le backend
import { fetchUserFromBackend, fetchDinosaurFromBackend } from '../../services/authService';
// Importation des composants utilisés dans la page Dashboard
import UserInfo from '../../components/Dashboard/UserInfo';
import DinosaurInfo from '../../components/Dashboard/DinosaurInfo';
import Actions from '../../components/Dashboard/Actions';
import Header from '../../components/Common/Header';
import Footer from '../../components/Common/Footer';
// Importation du fichier CSS spécifique à la page Dashboard
import './DashboardPage.css'; 

// Importation des types TypeScript pour assurer la typage des données
import { User } from '../../types/User';
import { Dinosaur } from '../../types/Dinosaur';

// Définition du composant fonctionnel DashboardPage
const DashboardPage: React.FC = () => {
    // États pour stocker les informations de l'utilisateur et du dinosaure
    const [user, setUser] = useState<User | null>(null);
    const [dinosaur, setDinosaur] = useState<Dinosaur | null>(null);

    /**
     * Fonction asynchrone pour initialiser la page en récupérant les données utilisateur et dinosaure
     */
    const initializePage = async () => {
        try {
            // Récupération des données utilisateur depuis le backend
            const fetchedUser = await fetchUserFromBackend();
            // Récupération des données dinosaure depuis le backend
            const fetchedDinosaur = await fetchDinosaurFromBackend();
            // Mise à jour des états avec les données récupérées
            setUser(fetchedUser);
            setDinosaur(fetchedDinosaur);
        } catch (error) {
            console.error('Erreur lors de l\'initialisation de la page :', error);
            // Optionnel : Rediriger vers la page d'accueil ou afficher un message d'erreur
        }
    };

    // Hook useEffect pour appeler initializePage au montage du composant
    useEffect(() => {
        initializePage();
    }, []);

    /**
     * Fonction asynchrone pour rafraîchir les données du dinosaure
     */
    const refreshDinosaur = async () => {
        try {
            // Récupération des données dinosaure mises à jour depuis le backend
            const updatedDinosaur = await fetchDinosaurFromBackend();
            // Mise à jour de l'état avec les nouvelles données
            setDinosaur(updatedDinosaur);
        } catch (error) {
            console.error('Erreur lors de la mise à jour des données du dinosaure :', error);
            // Optionnel : Afficher un message d'erreur à l'utilisateur
        }
    };

    return (
        <>
            {/* Composant Header commun à toutes les pages */}
            <Header />
            {/* Conteneur principal de la page Dashboard */}
            <div id="main">
                {/* Section Infos contenant les informations de l'utilisateur et du dinosaure */}
                <div id="Infos">
                    {/* Affichage conditionnel du composant UserInfo si les données utilisateur sont disponibles */}
                    {user && <UserInfo user={user} />}
                    {/* Affichage conditionnel du composant DinosaurInfo si les données dinosaure sont disponibles */}
                    {dinosaur && <DinosaurInfo dinosaur={dinosaur} />}
                </div>
                {/* Section Middle contenant la barre XP et l'image du dinosaure */}
                <div id="Middle">
                    {/* Titre de la page Dashboard */}
                    <div className="Title">
                        IdleSaur🦖
                    </div>
                    {/* Partie supérieure de la section Middle */}
                    <div className="topMiddle">
                        {/* Barre XP indiquant l'expérience du dinosaure */}
                        <div className="xp-bar">
                            {/* Barre de progression dont la largeur est proportionnelle à l'expérience */}
                            <div className="xp-progress" style={{ width: `${(dinosaur?.experience || 0) / 100}%` }}></div>
                        </div>
                    </div>
                    {/* Partie inférieure de la section Middle */}
                    <div className="bottomMiddle">
                        <div className="middleContent">
                            {/* Affichage conditionnel de l'image du dinosaure selon son régime alimentaire */}
                            {dinosaur && (
                                <img
                                    src={`/assets/dino/dino_${dinosaur.diet}.svg`} // Chemin vers l'image du dinosaure
                                    alt={`Dinosaure ${dinosaur.name}`} // Texte alternatif pour l'accessibilité
                                    className="dino-svg" // Classe CSS pour le style de l'image
                                />
                            )}
                        </div>
                    </div>
                </div>
                {/* Section Actions contenant les différentes actions possibles sur le dinosaure */}
                <div id="Actions">
                    {/* Affichage conditionnel du composant Actions si les données dinosaure sont disponibles */}
                    {dinosaur && <Actions dinosaur={dinosaur} refreshDinosaur={refreshDinosaur} />}
                </div>
            </div>
            {/* Composant Footer commun à toutes les pages */}
            {/* <Footer /> */}
        </>
    );
};

export default DashboardPage;
