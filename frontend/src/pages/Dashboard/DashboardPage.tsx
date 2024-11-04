import React, { useEffect, useState } from 'react';
import { fetchDinosaurActions , getNextLevelXp} from '../../services/dinosaurService';
import DinosaurInfo from '../../components/Dashboard/DinosaurInfo';
import Actions, { ActionDetail } from '../../components/Dashboard/Actions';
import EventOverlay from '../../components/Dashboard/EventOverlay'; 
import Header from '../../components/Common/Header';
import Footer from '../../components/Common/Footer';
import './DashboardPage.css'; 
import { User } from '../../types/User';
import { Dinosaur } from '../../types/Dinosaur';
import { fetchDinosaurFromBackend, fetchUserFromBackend } from '../../services/authService';
import BackgroundOverlay from '../../components/Dashboard/BackgroundOverlay';
import Gauge_XP from '../../components/Dashboard/utils/Gauge_XP';

// Définitions des chemins d'images de fond pour chaque époque
const EPOCH_BACKGROUND_IMAGES: Record<string, string> = {
    past: '/assets/img/FirstTime.jpg',
    present: '/assets/img/FifthTime.jpg', // Nom inventé pour l'époque du milieu
    future: '/assets/img/Cybercity.jpg',
};

/**
 * Composant fonctionnel représentant la page Dashboard.
 * Affiche les informations de l'utilisateur, les informations du dinosaure, et les actions possibles.
 */
const DashboardPage: React.FC = () => {
    // États pour stocker les informations de l'utilisateur et du dinosaure
    const [user, setUser] = useState<User | null>(null);
    const [max_experience, setMAX_XP] = useState <number>(0);
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
    
            // Récupération de l'expérience maximale du prochain niveau
            const maxExperienceResponse = await getNextLevelXp();
    
            // Supposons que l'API retourne un objet { nextLevelXp: 1000 }
            // Extraire directement la valeur numérique
            const maxExperience = maxExperienceResponse.nextLevelXp; 
    
            console.log("max xp :", maxExperience);
    
            // Mise à jour des états avec les données récupérées
            setMAX_XP(maxExperience);
            setUser(fetchedUser);
            setDinosaur(fetchedDinosaur);
            setAvailableActions(fetchedActions.availableActions);
        } catch (error) {
            console.error("Erreur lors de l'initialisation de la page :", error);
            // Optionnel : Rediriger vers la page d'accueil ou afficher un message d'erreur
        }
    };

    /**
     * Fonction asynchrone pour rafraîchir les données du dinosaure et les actions disponibles.
     */
    const refreshDinosaur = async () => {
        try {
            const updatedDinosaur = await fetchDinosaurFromBackend();
            const updatedActions = await fetchDinosaurActions();
            const maxExperienceResponse = await getNextLevelXp();
            const maxExperience = maxExperienceResponse.nextLevelXp;

            setDinosaur(updatedDinosaur);
            setAvailableActions(updatedActions.availableActions);
            setMAX_XP(maxExperience);
        } catch (error) {
            console.error('Erreur lors de la mise à jour des données du dinosaure :', error);
        }
    };

    /**
     * Fonction pour gérer l'affichage de l'événement.
     * @param eventMessage Message de l'événement à afficher.
     */
    const handleEventDisplay = (eventMessage: string) => {
        setLastEvent(eventMessage);
        setTimeout(() => setLastEvent(null), 2000); // Cache l'overlay après 3 secondes
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


    const experience = dinosaur ? dinosaur.experience : 0;

    return (
        <>
            {/* Overlay d'image dynamique */}
            {dinosaur && (
                <BackgroundOverlay epoch={dinosaur.epoch} backgroundImages={EPOCH_BACKGROUND_IMAGES} />
            )}
            {/* Composant Header commun à toutes les pages */}
            <Header />
            {/* Conteneur principal de la page Dashboard */}
            <div id="main">
                {/* Section Infos contenant les informations de l'utilisateur et du dinosaure */}
                <div id="Infos">

                    {dinosaur && <DinosaurInfo dinosaur={dinosaur} />}
                    
                </div>
                {/* Section Middle contenant la barre XP et l'image du dinosaure */}
                <div id="Middle">
                    {/* Partie supérieure de la section Middle */}
                    <div className="topMiddle">
                        {/* Barre XP indiquant l'expérience du dinosaure */}
                        
                        <Gauge_XP
                            label={`level: ${dinosaur ? dinosaur.level : "NaN"}`}
                            current={experience}
                            max={max_experience}
                            color="blue"
                        />
                    </div>
                    {/* Partie inférieure de la section Middle */}
                    <div className="bottomMiddle">
                        <div className="middleContent">
                            {/* Affichage conditionnel de l'image du dinosaure selon son régime alimentaire */}
                            {dinosaur && (
                                <img
                                    src={`/assets/dino/dino_${dinosaur.diet}.svg`} // Chemin absolu vers l'image du dinosaure
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
