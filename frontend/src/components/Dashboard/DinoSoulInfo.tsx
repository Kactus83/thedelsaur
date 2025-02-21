import React, { useState } from 'react';
import './DinoSoulInfo.css';
import { Dinosaur } from '../../types/Dinosaur';

interface DinoSoulInfoProps {
  dinosaur: Dinosaur;
}

const DinoSoulInfo: React.FC<DinoSoulInfoProps> = ({ dinosaur }) => {
  const [showOverlay, setShowOverlay] = useState<boolean>(false);

  // Calcul des totaux issus de l'historique des vies
  const totalNeutral = dinosaur.lives.reduce((sum, life) => sum + life.soul_points, 0);
  const totalDark = dinosaur.lives.reduce((sum, life) => sum + life.dark_soul_points, 0);
  const totalBright = dinosaur.lives.reduce((sum, life) => sum + life.bright_soul_points, 0);
  const livesCount = dinosaur.lives.length;
  const lastLife = livesCount > 0 ? dinosaur.lives[livesCount - 1] : null;

  return (
    <div className="dino-soul-info-container">
      <div className="dino-soul-icon" onClick={() => setShowOverlay(!showOverlay)}>
        💀
      </div>
      {showOverlay && (
        <div className="dino-soul-overlay">
          <div className="overlay-header">
            <h4>Afterlife Stats</h4>
            <button className="close-btn" onClick={() => setShowOverlay(false)}>×</button>
          </div>
          <div className="overlay-content">
            <div className="stat-row">
              <span className="stat-label">Vies enregistrées:</span>
              <span className="stat-value">{livesCount}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Points Neutres:</span>
              <span className="stat-value">{totalNeutral}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Points Dark:</span>
              <span className="stat-value">{totalDark}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Points Bright:</span>
              <span className="stat-value">{totalBright}</span>
            </div>
            {lastLife && (
              <>
                <div className="stat-row">
                  <span className="stat-label">Dernière Vie - Niveau:</span>
                  <span className="stat-value">{lastLife.level}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Dernière Vie - Exp:</span>
                  <span className="stat-value">{lastLife.experience}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Dernière Vie - Karma:</span>
                  <span className="stat-value">{lastLife.karma}</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default DinoSoulInfo;
