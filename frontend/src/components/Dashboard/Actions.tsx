import * as React from 'react';
import {
    eatDinosaur,
    sleepDinosaur,
    wakeDinosaur,
    resurrectDinosaur,
    fetchDinosaurActions,
} from '../../services/dinosaurService';
import { Dinosaur } from '../../types/Dinosaur';
import './Actions.css';

interface ActionsProps {
    dinosaur: Dinosaur;
    refreshDinosaur: () => void;
}

const Actions: React.FC<ActionsProps> = ({ dinosaur, refreshDinosaur }) => {
    const [availableActions, setAvailableActions] = React.useState<string[]>([]);

    /**
     * Fonction pour récupérer les actions disponibles depuis le backend
     */
    const fetchActions = async () => {
        try {
            const data = await fetchDinosaurActions(); // Récupère les actions disponibles
            setAvailableActions(data.availableActions); // Met à jour les actions disponibles
            console.log(data.availableActions);
        } catch (error: any) {
            alert(`Erreur lors de la récupération des actions: ${error.response?.data?.message || 'Erreur interne du serveur.'}`);
        }
    };

    // Récupérer les actions dès le montage du composant
    React.useEffect(() => {
        fetchActions();
    }, [dinosaur]);

    /**
     * Fonction pour gérer l'action de manger
     */
    const handleEat = async () => {
        try {
            await eatDinosaur();
            alert('Le dinosaure a mangé avec succès !');
            refreshDinosaur();
            fetchActions(); // Rafraîchir les actions après l'action
        } catch (error: any) {
            alert(`Erreur: ${error.response?.data?.message || 'Erreur interne du serveur.'}`);
        }
    };

    /**
     * Fonction pour gérer l'action de dormir
     */
    const handleSleep = async () => {
        try {
            await sleepDinosaur();
            alert('Le dinosaure est maintenant en sommeil.');
            refreshDinosaur();
            fetchActions();
        } catch (error: any) {
            alert(`Erreur: ${error.response?.data?.message || 'Erreur interne du serveur.'}`);
        }
    };

    /**
     * Fonction pour gérer l'action de réveil
     */
    const handleWake = async () => {
        try {
            await wakeDinosaur();
            alert('Le dinosaure s\'est réveillé.');
            refreshDinosaur();
            fetchActions();
        } catch (error: any) {
            alert(`Erreur: ${error.response?.data?.message || 'Erreur interne du serveur.'}`);
        }
    };

    /**
     * Fonction pour gérer l'action de résurrection
     */
    const handleResurrect = async () => {
        try {
            await resurrectDinosaur();
            alert('Le dinosaure a été ressuscité.');
            refreshDinosaur();
            fetchActions();
        } catch (error: any) {
            alert(`Erreur: ${error.response?.data?.message || 'Erreur interne du serveur.'}`);
        }
    };

    // Vérification si une action est disponible
    const canPerformAction = (action: string) => availableActions.includes(action.toLowerCase());


    return (
        <div className="actions">
            <button
                onClick={handleEat}
                disabled={!canPerformAction('Eat')}
            >
                Manger
            </button>
            <button
                onClick={handleSleep}
                disabled={!canPerformAction('Sleep')}
            >
                Se Mettre en Sommeil
            </button>
            <button
                onClick={handleWake}
                disabled={!canPerformAction('WakeUp')}
            >
                Se Réveiller
            </button>
            <button
                onClick={handleResurrect}
                disabled={!canPerformAction('Resurrect')}
            >
                Ressusciter
            </button>
        </div>
    );
};

export default Actions;
