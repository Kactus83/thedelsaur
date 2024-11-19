import React from 'react';
import { Dinosaur } from '../../types/Dinosaur';
import { DinosaurEvent } from '../../types/DinosaurEvent';
import { ActionDetail } from './Actions';
import './DinoDisplay.css';

// Interface pour les propriétés du composant BackgroundOverlay
interface DinoDisplayProps {
    dinosaur: Dinosaur;
    lastEvent: DinosaurEvent | null;
    action: ActionDetail | null;
}


const DinoDisplay: React.FC<DinoDisplayProps> = ( props : DinoDisplayProps) => {

    // Génération dynamique du chemin de l'image en fonction de diet et type du dinosaure
    const dinosaurImagePath = props.dinosaur ? `/assets/dino/dino_${props.dinosaur.diet}_${props.dinosaur.type}.svg` : '';

    let animation = '';
    
    switch(props.action?.name){
        case null:
            break;
        case 'Se Réveiller':
            break;
        case 'Manger':
            animation= 'baisser';
            break;
        case 'Dormir':
            break;
        case 'Cueillir':
            animation= 'baisser';
            break;
        case 'Chasser':
            animation= 'wonder';
            break;
        case 'Découvrir':
            animation= 'wonder';
            break;
        case 'Voler':
            animation= 'wonder';
            break;
        default: 
            break;
    }
    

    const className = `dino-svg ${props.dinosaur.isDead ? 'dino-dead' : 'dino-alive'} ${
        props.action ? animation : ''
    }`;

    return (
        <img
        src={dinosaurImagePath}
        alt={`Dinosaure ${props.dinosaur.name}`}
        className={className}
    />
    );
};

export default DinoDisplay;

