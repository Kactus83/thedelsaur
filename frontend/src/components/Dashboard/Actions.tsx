import * as React from 'react';
// Importation des services pour effectuer les actions sur le dinosaure
import { eatDinosaur, sleepDinosaur, wakeDinosaur, resurrectDinosaur } from '../../services/dinosaurService';
// Importation du type Dinosaur pour la typage des propriétés
import { Dinosaur } from '../../types/Dinosaur';
// Importation du fichier CSS spécifique au composant Actions
import './Actions.css'; 

// Interface définissant les propriétés attendues par le composant Actions
interface ActionsProps {
    dinosaur: Dinosaur; // Objet dinosaure sur lequel effectuer les actions
    refreshDinosaur: () => void; // Fonction pour rafraîchir les données du dinosaure après une action
}

// Définition du composant fonctionnel Actions
const Actions: React.FC<ActionsProps> = ({ dinosaur, refreshDinosaur }) => {
    /**
     * Fonction pour gérer l'action de manger
     */
    const handleEat = async () => {
        try {
            await eatDinosaur(); // Appel au service eatDinosaur pour effectuer l'action
            alert('Le dinosaure a mangé avec succès !'); // Notification de succès
            refreshDinosaur(); // Rafraîchissement des données du dinosaure
        } catch (error: any) {
            // Affichage d'un message d'erreur en cas de problème
            alert(`Erreur: ${error.response?.data?.message || 'Erreur interne du serveur.'}`);
        }
    };

    /**
     * Fonction pour gérer l'action de dormir
     */
    const handleSleep = async () => {
        try {
            await sleepDinosaur(); // Appel au service sleepDinosaur pour effectuer l'action
            alert('Le dinosaure est maintenant en sommeil.'); // Notification de succès
            refreshDinosaur(); // Rafraîchissement des données du dinosaure
        } catch (error: any) {
            // Affichage d'un message d'erreur en cas de problème
            alert(`Erreur: ${error.response?.data?.message || 'Erreur interne du serveur.'}`);
        }
    };

    /**
     * Fonction pour gérer l'action de réveil
     */
    const handleWake = async () => {
        try {
            await wakeDinosaur(); // Appel au service wakeDinosaur pour effectuer l'action
            alert('Le dinosaure s\'est réveillé.'); // Notification de succès
            refreshDinosaur(); // Rafraîchissement des données du dinosaure
        } catch (error: any) {
            // Affichage d'un message d'erreur en cas de problème
            alert(`Erreur: ${error.response?.data?.message || 'Erreur interne du serveur.'}`);
        }
    };

    /**
     * Fonction pour gérer l'action de résurrection
     */
    const handleResurrect = async () => {
        try {
            await resurrectDinosaur(); // Appel au service resurrectDinosaur pour effectuer l'action
            alert('Le dinosaure a été ressuscité.'); // Notification de succès
            refreshDinosaur(); // Rafraîchissement des données du dinosaure
        } catch (error: any) {
            // Affichage d'un message d'erreur en cas de problème
            alert(`Erreur: ${error.response?.data?.message || 'Erreur interne du serveur.'}`);
        }
    };

    return (
        <div className="actions">
            {/* Bouton pour l'action de manger */}
            <button
                onClick={handleEat}
                disabled={dinosaur.isDead || dinosaur.isSleeping || dinosaur.food <= 500} // Désactivation selon l'état du dinosaure
            >
                Manger
            </button>
            {/* Bouton pour l'action de dormir */}
            <button
                onClick={handleSleep}
                disabled={dinosaur.isDead || dinosaur.isSleeping || dinosaur.energy > 2500} // Désactivation selon l'état du dinosaure
            >
                Se Mettre en Sommeil
            </button>
            {/* Bouton pour l'action de réveil */}
            <button
                onClick={handleWake}
                disabled={dinosaur.isDead || !dinosaur.isSleeping || dinosaur.energy < 7500} // Désactivation selon l'état du dinosaure
            >
                Se Réveiller
            </button>
            {/* Bouton pour l'action de résurrection */}
            <button
                onClick={handleResurrect}
                disabled={!dinosaur.isDead} // Désactivation si le dinosaure n'est pas mort
            >
                Ressusciter
            </button>
        </div>
    );
};

export default Actions;
