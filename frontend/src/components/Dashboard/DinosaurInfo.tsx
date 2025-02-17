import React from 'react';
import { Dinosaur } from '../../types/Dinosaur';
import './DinosaurInfo.css';
import Gauge from './utils/Gauge';

interface DinosaurInfoProps {
    dinosaur: Dinosaur;
}

export function calculateDinosaurAge(lastReborn: string): string {
    const lastRebornDate = new Date(lastReborn);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - lastRebornDate.getTime();

    const days = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffInMilliseconds / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diffInMilliseconds / (1000 * 60)) % 60);
    const seconds = Math.floor((diffInMilliseconds / 1000) % 60);

    return `${hours} heures, ${minutes} min, ${seconds} sec`;
}

const DinosaurInfo: React.FC<DinosaurInfoProps> = ({ dinosaur }) => {
    return (
        <div className="dinosaur-info">
            <h3>Dinosaure : {dinosaur.name}</h3>
            <p><strong>Régime alimentaire</strong> : {capitalizeFirstLetter(dinosaur.diet)}</p>
            <p><strong>Type</strong> : {capitalizeFirstLetter(dinosaur.type)}</p>

            {/* Utilisation de Gauge avec les tooltips pour Énergie, Nourriture et Faim */}
            <Gauge
                label="Énergie"
                current={dinosaur.energy}
                max={dinosaur.max_energy}
                color="#4CAF50"
                tooltipText={`Capacité max d'énergie augmentée par : ${dinosaur.multipliers.max_energy_multiplier}x, vitesse augamentée par : ${dinosaur.multipliers.earn_energy_multiplier}`}
            />
            <Gauge
                label="Nourriture"
                current={dinosaur.food}
                max={dinosaur.max_food}
                color="#FF9800"
                tooltipText={`Capacité max de nourriture augmentée par : ${dinosaur.multipliers.max_food_multiplier}x, Multiplicateurs de gains : Herbi ${dinosaur.multipliers.earn_herbi_food_multiplier}x, Carni ${dinosaur.multipliers.earn_carni_food_multiplier}x, Global ${dinosaur.multipliers.earn_food_multiplier}x`}
            />
            <Gauge
                label="Faim"
                current={dinosaur.hunger}
                max={dinosaur.max_hunger}
                color="#F44336"
                tooltipText={`penser a implementer un bonus`}
            />
            
            <p><strong>Âge</strong> : {calculateDinosaurAge(dinosaur.last_reborn)}</p>
            <p><strong>Époque</strong> : {dinosaur.epoch}</p>
            <p><strong>Nombre de renaissances</strong> : {dinosaur.reborn_amount}</p>
            <p><strong>Karma</strong> : {dinosaur.karma}</p>
            <p className='notDisplayed'><strong>Créé le </strong>: {new Date(dinosaur.created_at).toLocaleDateString()}</p>
            <p className='notDisplayed'><strong>Dernière mise à jour</strong> : {new Date(dinosaur.last_update_by_time_service).toLocaleDateString()}</p>
            <p><strong>En Sommeil</strong> : {dinosaur.isSleeping ? 'Oui' : 'Non'}</p>
            <p><strong>Mort</strong> : {dinosaur.isDead ? 'Oui' : 'Non'}</p>
        </div>
    );
};

const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export default DinosaurInfo;
