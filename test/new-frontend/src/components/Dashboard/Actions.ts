import * as React from 'react';
import { eatDinosaur, sleepDinosaur, wakeDinosaur, resurrectDinosaur } from '../../services/dinosaurService';
import { Dinosaur } from '../../types/Dinosaur';
import './Actions.css'; 

interface ActionsProps {
    dinosaur: Dinosaur;
    refreshDinosaur: () => void;
}

const Actions: React.FC<ActionsProps> = ({ dinosaur, refreshDinosaur }) => {
    const handleEat = async () => {
        try {
            await eatDinosaur();
            alert('Le dinosaure a mangé avec succès !');
            refreshDinosaur();
        } catch (error: any) {
            alert(`Erreur: ${error.response?.data?.message || 'Erreur interne du serveur.'}`);
        }
    };

    const handleSleep = async () => {
        try {
            await sleepDinosaur();
            alert('Le dinosaure est maintenant en sommeil.');
            refreshDinosaur();
        } catch (error: any) {
            alert(`Erreur: ${error.response?.data?.message || 'Erreur interne du serveur.'}`);
        }
    };

    const handleWake = async () => {
        try {
            await wakeDinosaur();
            alert('Le dinosaure s\'est réveillé.');
            refreshDinosaur();
        } catch (error: any) {
            alert(`Erreur: ${error.response?.data?.message || 'Erreur interne du serveur.'}`);
        }
    };

    const handleResurrect = async () => {
        try {
            await resurrectDinosaur();
            alert('Le dinosaure a été ressuscité.');
            refreshDinosaur();
        } catch (error: any) {
            alert(`Erreur: ${error.response?.data?.message || 'Erreur interne du serveur.'}`);
        }
    };

    return (
        <div className="actions">
            <button
                onClick={handleEat}
                disabled={dinosaur.isDead || dinosaur.isSleeping || dinosaur.food <= 500}
            >
                Manger
            </button>
            <button
                onClick={handleSleep}
                disabled={dinosaur.isDead || dinosaur.isSleeping || dinosaur.energy > 2500}
            >
                Se Mettre en Sommeil
            </button>
            <button
                onClick={handleWake}
                disabled={dinosaur.isDead || !dinosaur.isSleeping || dinosaur.energy < 7500}
            >
                Se Réveiller
            </button>
            <button
                onClick={handleResurrect}
                disabled={!dinosaur.isDead}
            >
                Ressusciter
            </button>
        </div>
    );
};

export default Actions;