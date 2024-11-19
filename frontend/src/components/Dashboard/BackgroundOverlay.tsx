import React from 'react';
import { Dinosaur } from '../../types/Dinosaur';
import { Epoch } from '../../types/Epoch';
import { DinosaurEvent } from '../../types/DinosaurEvent';
import { ActionDetail } from './Actions';

// Interface pour les propriétés du composant BackgroundOverlay
interface BackgroundOverlayProps {
    dinosaur: Dinosaur;
    lastEvent: DinosaurEvent | null;
    action: ActionDetail | null;
}


const EPOCH_BACKGROUND_IMAGES: Record<Epoch, string> = Object.values(Epoch).reduce((acc, epoch) => {
    acc[epoch as Epoch] = `/assets/img/epochs/${epoch}.webp`;
    return acc;
}, {} as Record<Epoch, string>);


const BackgroundOverlay: React.FC<BackgroundOverlayProps> = ( props : BackgroundOverlayProps) => {

    let imageUrl = EPOCH_BACKGROUND_IMAGES[props.dinosaur.epoch] || EPOCH_BACKGROUND_IMAGES[Epoch.Ancient_Epoch1];
    
    if(props.dinosaur.isDead){
        imageUrl= `/assets/img/epochs/graveyard.webp`;
    }

    const overlayStyle: React.CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: -1, // S'assure que l'overlay est derrière tout autre contenu
    };

    const imgStyle: React.CSSProperties = {
        width: '100%',
        height: '100%',
        objectFit: 'cover', // S'assure que l'image couvre tout l'espace
    };

   

    return (
        <div style={overlayStyle}>
            <img src={imageUrl} alt="Background" style={imgStyle} />
        </div>
    );
};

export default BackgroundOverlay;
