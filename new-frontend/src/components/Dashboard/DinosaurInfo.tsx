import React from 'react';
// Importation du type Dinosaur pour la typage des propriétés
import { Dinosaur } from '../../types/Dinosaur';
// Importation du fichier CSS spécifique au composant DinosaurInfo
import './DinosaurInfo.css'; 

// Interface définissant les propriétés attendues par le composant DinosaurInfo
interface DinosaurInfoProps {
    dinosaur: Dinosaur; // Objet dinosaure contenant les informations à afficher
}

// Définition du composant fonctionnel DinosaurInfo
const DinosaurInfo: React.FC<DinosaurInfoProps> = ({ dinosaur }) => {
    return (
        <div className="dinosaur-info">
            <h3>Dinosaure : {dinosaur.name}</h3>
            <p>Régime alimentaire : {capitalizeFirstLetter(dinosaur.diet)}</p>
            <p>Énergie : {dinosaur.energy} / {dinosaur.max_energy}</p>
            <p>Nourriture : {dinosaur.food} / {dinosaur.max_food}</p>
            <p>Expérience : {dinosaur.experience}</p>
            <p>Époque : {dinosaur.epoch}</p>
            <p>Créé le : {new Date(dinosaur.created_at).toLocaleDateString()}</p>
            <p>Dernière mise à jour : {new Date(dinosaur.last_update_by_time_service).toLocaleDateString()}</p>
            <p>En Sommeil : {dinosaur.isSleeping ? 'Oui' : 'Non'}</p>
            <p>Mort : {dinosaur.isDead ? 'Oui' : 'Non'}</p>
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
