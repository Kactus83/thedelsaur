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
            <p><strong>Régime alimentaire</strong> : {capitalizeFirstLetter(dinosaur.diet)}</p>
            <p><strong>Énergie</strong> : {dinosaur.energy} / {dinosaur.max_energy}</p>
            <p><strong>Nourriture</strong> : {dinosaur.food} / {dinosaur.max_food}</p>
            <p><strong>Faim</strong> : {dinosaur.hunger} / {dinosaur.max_hunger}</p>
            <p><strong>Expérience</strong> : {dinosaur.experience}</p>
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
