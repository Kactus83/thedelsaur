import React from 'react';
// Importation du type Dinosaur pour la typage des propriétés
import { Dinosaur } from '../../types/Dinosaur';
// Importation du fichier CSS spécifique au composant DinosaurInfo
import './DinosaurInfo.css'; 

// Interface définissant les propriétés attendues par le composant DinosaurInfo
interface DinosaurInfoProps {
    dinosaur: Dinosaur; // Objet dinosaure contenant les informations à afficher
}

/**
 * Calcule l'âge d'un dinosaure en jours, heures, minutes et secondes à partir de last_reborn.
 * @param lastReborn Timestamp de la dernière renaissance du dinosaure.
 * @returns Chaîne formatée indiquant l'âge du dinosaure.
 */
export function calculateDinosaurAge(lastReborn: string): string {
    const lastRebornDate = new Date(lastReborn);
    const now = new Date();
    const diffInMilliseconds = now.getTime() - lastRebornDate.getTime();

    // Convertir le temps écoulé en jours, heures, minutes et secondes
    const days = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffInMilliseconds / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diffInMilliseconds / (1000 * 60)) % 60);
    const seconds = Math.floor((diffInMilliseconds / 1000) % 60);

    return `${days} jours, ${hours} heures, ${minutes} minutes, ${seconds} secondes`;
}

// Définition du composant fonctionnel DinosaurInfo
const DinosaurInfo: React.FC<DinosaurInfoProps> = ({ dinosaur }) => {
    return (
        <div className="dinosaur-info">
            <h3>Dinosaure : {dinosaur.name}</h3>
            <p><strong>Niveau</strong> : {dinosaur.level}</p>
            <p><strong>Régime alimentaire</strong> : {capitalizeFirstLetter(dinosaur.diet)}</p>
            <p><strong>Énergie</strong> : {dinosaur.energy} / {dinosaur.max_energy}</p>
            <p><strong>Nourriture</strong> : {dinosaur.food} / {dinosaur.max_food}</p>
            <p><strong>Faim</strong> : {dinosaur.hunger} / {dinosaur.max_hunger}</p>
            <p><strong>Expérience</strong> : {dinosaur.experience}</p>
            <p><strong>Âge</strong> : {calculateDinosaurAge(dinosaur.last_reborn)}</p> {/* Nouvelle ligne pour afficher l'âge */}
            <p><strong>Époque</strong> : {dinosaur.epoch}</p>
            <p><strong>Créé le </strong>: {new Date(dinosaur.created_at).toLocaleDateString()}</p>
            <p><strong>Dernière mise à jour</strong> : {new Date(dinosaur.last_update_by_time_service).toLocaleDateString()}</p>
            <p><strong>En Sommeil</strong> : {dinosaur.isSleeping ? 'Oui' : 'Non'}</p>
            <p><strong>Mort</strong> : {dinosaur.isDead ? 'Oui' : 'Non'}</p>
        </div>
    );
};

/**
 * Fonction utilitaire pour capitaliser la première lettre d'une chaîne de caractères
 * @param string Chaîne de caractères à modifier
 * @returns Chaîne de caractères avec la première lettre en majuscule
 */
const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};

export default DinosaurInfo;
