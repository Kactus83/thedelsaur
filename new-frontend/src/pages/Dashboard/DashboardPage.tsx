import React, { useEffect, useState } from 'react';
import { fetchDinosaurFromBackend, fetchUserFromBackend } from '../../services/authService';
import UserInfo from '../../components/Dashboard/UserInfo';
import DinosaurInfo from '../../components/Dashboard/DinosaurInfo';
import Actions from '../../components/Dashboard/Actions';
import Header from '../../components/Common/Header';
import Footer from '../../components/Common/Footer';
import './DashboardPage.css'; 
import { User } from '../../types/User';
import { Dinosaur } from '../../types/Dinosaur';

/**
 * Composant fonctionnel représentant la page Dashboard.
 * Affiche les informations de l'utilisateur, les informations du dinosaure, et les actions possibles.
 */
const DashboardPage: React.FC = () => {
    // États pour stocker les informations de l'utilisateur et du dinosaure
    const [user, setUser] = useState<User | null>(null);
    const [dinosaur, setDinosaur] = useState<Dinosaur | null>(null);

    /**
     * Fonction asynchrone pour initialiser la page en récupérant les données utilisateur et dinosaure.
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

    /**
     * Fonction asynchrone pour rafraîchir les données du dinosaure.
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

    /**
     * Hook useEffect pour initialiser la page au montage du composant.
     */
    useEffect(() => {
        initializePage();
    }, []);

    /**
     * Hook useEffect pour mettre en place un intervalle qui rafraîchit les données du dinosaure toutes les 1.1 secondes.
     * Nettoie l'intervalle lors du démontage du composant.
     */
    useEffect(() => {
        // Définition de l'intervalle en millisecondes (1100 ms = 1.1 secondes)
        const interval = setInterval(() => {
            refreshDinosaur();
        }, 1100);

        // Fonction de nettoyage pour supprimer l'intervalle lors du démontage
        return () => clearInterval(interval);
    }, []);

    // Calcul de la largeur de la barre XP avec une limite à 100%
    const xpWidth = dinosaur ? Math.min(dinosaur.experience / 100, 100) : 0;

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
                    {/* Partie supérieure de la section Middle */}
                    <div className="topMiddle">
                        {/* Barre XP indiquant l'expérience du dinosaure */}
                        <div className="xp-bar">
                            {/* Barre de progression dont la largeur est proportionnelle à l'expérience */}
                            <div className="xp-progress" style={{ width: `${xpWidth}%` }}></div>
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
            {/* Décommenter le Footer si nécessaire */}
            {/* <Footer /> */}
        </>
    );
};

export default DashboardPage;
