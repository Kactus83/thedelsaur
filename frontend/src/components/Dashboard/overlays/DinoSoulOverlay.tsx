import React from 'react';
import './DinoSoulOverlay.css';
import { Dinosaur } from '../../../types/Dinosaur';

/**
 * Composant affichant en overlay plein écran les statistiques des vies passées du dinosaure.
 * Il ne rend rien si "active" n'est pas vrai, pour rester homogène aux autres overlays.
 */
const DinoSoulOverlay: React.FC<{
  dinosaur: Dinosaur;
  onClose: () => void;
  active?: boolean;
}> = ({ dinosaur, onClose, active = false }) => {
  if (!active) return null;

  // Totaux sur l'historique des vies
  const totalNeutral = dinosaur.lives.reduce((sum, life) => sum + life.soul_points, 0);
  const totalDark    = dinosaur.lives.reduce((sum, life) => sum + life.dark_soul_points, 0);
  const totalBright  = dinosaur.lives.reduce((sum, life) => sum + life.bright_soul_points, 0);

  const livesCount = dinosaur.lives.length;
  const lastLife   = livesCount > 0 ? dinosaur.lives[livesCount - 1] : null;

  const getEmojiForSoulType = (type: string): string => {
    if (type === 'neutral') return '⚖️';
    if (type === 'bright')  return '🌟';
    if (type === 'dark')    return '🌑';
    return '❓';
  };

  return (
    <div className="overlay active">
      <div className="overlay-content">
        <header className="overlay-header">
          <h2>Afterlife Stats</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </header>

        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-name">Vies enregistrées</span>
              <span className="stat-value">{livesCount}</span>
            </div>
            <div className="stat-card">
              <span className="stat-name">Points Neutres</span>
              <span className="stat-value">⚖️ {totalNeutral}</span>
            </div>
            <div className="stat-card">
              <span className="stat-name">Points Bright</span>
              <span className="stat-value">🌟 {totalBright}</span>
            </div>
            <div className="stat-card">
              <span className="stat-name">Points Dark</span>
              <span className="stat-value">🌑 {totalDark}</span>
            </div>
          </div>
        </section>

        {lastLife && (
          <section className="lastlife-section">
            <h3>Statistiques dernière vie</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <span className="stat-name">Niveau</span>
                <span className="stat-value">{lastLife.level}</span>
              </div>
              <div className="stat-card">
                <span className="stat-name">Expérience</span>
                <span className="stat-value">{lastLife.experience}</span>
              </div>
              <div className="stat-card">
                <span className="stat-name">Karma</span>
                <span className="stat-value">{lastLife.karma}</span>
              </div>
            </div>
          </section>
        )}

        {dinosaur.soulSkills.length > 0 && (
          <section className="soul-skills-section">
            <h3>Soul Skills débloquées</h3>
            <div className="soul-skills-grid">
              {dinosaur.soulSkills.map(skill => (
                <div key={skill.id} className="soul-skill-card">
                  <div className="soul-skill-emoji">
                    {getEmojiForSoulType(skill.soulType)}
                  </div>
                  <div className="soul-skill-name">{skill.name}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default DinoSoulOverlay;