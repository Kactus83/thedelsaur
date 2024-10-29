import React, { useEffect, useState } from 'react';
import { fetchDinosaurActions } from '../../services/dinosaurService';
import DinosaurInfo from '../../components/Dashboard/DinosaurInfo';
import Actions, { ActionDetail } from '../../components/Dashboard/Actions';
import EventOverlay from '../../components/Dashboard/EventOverlay'; 
import Header from '../../components/Common/Header';
import Footer from '../../components/Common/Footer';
import './DashboardPage.css'; 
import { User } from '../../types/User';
import { Dinosaur } from '../../types/Dinosaur';
import { fetchDinosaurFromBackend, fetchUserFromBackend } from '../../services/authService';

/**
 * Composant fonctionnel représentant la page Dashboard.
 * Affiche les informations de l'utilisateur, les informations du dinosaure, et les actions possibles.
 */
const DashboardPage: React.FC = () => {
    // États pour stocker les informations de l'utilisateur et du dinosaure
    const [user, setUser] = useState<User | null>(null);
    const [dinosaur, setDinosaur] = useState<Dinosaur | null>(null);
    const [availableActions, setAvailableActions] = useState<ActionDetail[]>([]); // État pour les actions
    const [lastEvent, setLastEvent] = useState<string | null>(null); // État pour l'événement affiché

    /**
     * Fonction asynchrone pour initialiser la page en récupérant les données utilisateur, dinosaure et actions.
     */
    const initializePage = async () => {
        try {
            // Récupération des données utilisateur depuis le backend
            const fetchedUser = await fetchUserFromBackend();
            // Récupération des données dinosaure depuis le backend
            const fetchedDinosaur = await fetchDinosaurFromBackend();
            // Récupération des actions disponibles depuis le backend
            const fetchedActions = await fetchDinosaurActions();
            // Mise à jour des états avec les données récupérées
            setUser(fetchedUser);
            setDinosaur(fetchedDinosaur);
            setAvailableActions(fetchedActions.availableActions);
        } catch (error) {
            console.error('Erreur lors de l\'initialisation de la page :', error);
            // Optionnel : Rediriger vers la page d'accueil ou afficher un message d'erreur
        }
    };

    /**
     * Fonction asynchrone pour rafraîchir les données du dinosaure et les actions disponibles.
     */
    const refreshDinosaur = async () => {
        try {
            // Récupération des données dinosaure mises à jour depuis le backend
            const updatedDinosaur = await fetchDinosaurFromBackend();
            // Récupération des actions disponibles mises à jour depuis le backend
            const updatedActions = await fetchDinosaurActions();
            // Mise à jour des états avec les nouvelles données
            setDinosaur(updatedDinosaur);
            setAvailableActions(updatedActions.availableActions);
        } catch (error) {
            console.error('Erreur lors de la mise à jour des données du dinosaure :', error);
            // Optionnel : Afficher un message d'erreur à l'utilisateur
        }
    };

    /**
     * Fonction pour gérer l'affichage de l'événement.
     * @param eventMessage Message de l'événement à afficher.
     */
    const handleEventDisplay = (eventMessage: string) => {
        setLastEvent(eventMessage);
        setTimeout(() => setLastEvent(null), 3000); // Cache l'overlay après 3 secondes
    };

    // Initialiser les données au montage du composant
    useEffect(() => {
        initializePage();
    }, []);

    // Mettre en place un intervalle qui rafraîchit les données toutes les 1,1 secondes
    useEffect(() => {
        const interval = setInterval(() => {
            refreshDinosaur();
        }, 1100);
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
                                    src={`../../assets/dino/dino_${dinosaur.diet}.svg`} // Chemin vers l'image du dinosaure
                                    alt={`Dinosaure ${dinosaur.name}`} // Texte alternatif pour l'accessibilité
                                    className="dino-svg" // Classe CSS pour le style de l'image
                                />
                            )}
                            {/* Affichage de l'overlay si un événement est présent */}
                            {lastEvent && <EventOverlay eventMessage={lastEvent} />}
                        </div>
                    </div>
                </div>
                {/* Section Actions */}
                <div id="Actions">
                    {/* Affichage conditionnel du composant Actions */}
                    {dinosaur && (
                        <Actions
                            refreshDinosaur={refreshDinosaur}
                            availableActions={availableActions}
                            onActionEvent={handleEventDisplay}
                        />
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default DashboardPage;
