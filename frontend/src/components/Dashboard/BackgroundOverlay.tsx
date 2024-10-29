import React from 'react';

// Interface pour les propriétés du composant BackgroundOverlay
interface BackgroundOverlayProps {
    epoch: string;
    backgroundImages: Record<string, string>;
}

const BackgroundOverlay: React.FC<BackgroundOverlayProps> = ({ epoch, backgroundImages }) => {
    const imageUrl = backgroundImages[epoch] || backgroundImages['past'];

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
