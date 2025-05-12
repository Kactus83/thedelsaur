import React, { useEffect, useState } from 'react';
import './RankingOverlay.css';
import { fetchRanking } from '../../../services/rankingService';
import { User } from '../../../types/User';

interface RankingOverlayProps {
  onClose: () => void;
  active?: boolean;
}

type RankingTab = 'soulPoints' | 'experience' | 'karma' | 'lifetime';

const tabLabels: Record<RankingTab, string> = {
  soulPoints: 'Soul Points',
  experience: 'Expérience',
  karma: 'Karma',
  lifetime: 'Durée de vie'
};

const RankingOverlay: React.FC<RankingOverlayProps> = ({ onClose, active = false }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<RankingTab>('soulPoints');

  useEffect(() => {
    if (!active) return;
    (async () => {
      setLoading(true);
      try {
        const data = await fetchRanking();
        setUsers(data);
      } catch (e) {
        console.error('Erreur récupération classement', e);
      } finally {
        setLoading(false);
      }
    })();
  }, [active]);

  const keyMap: Record<RankingTab, (u: User) => number> = {
    soulPoints: u => u.player_score?.totalSoulPoints ?? 0,
    experience: u => u.player_score?.totalExperience ?? 0,
    karma: u => u.player_score?.latestKarma ?? 0,
    lifetime: u => u.player_score?.totalLifetime ?? 0,
  };

  const sorted = [...users].sort((a, b) => keyMap[activeTab](b) - keyMap[activeTab](a));

  if (!active) return null;

  return (
    <div className="overlay active">
      <div className="overlay-content ranking-overlay-content">
        <header className="ranking-header">
          <h2>Classements</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </header>

        <nav className="ranking-tabs">
          {(Object.keys(tabLabels) as RankingTab[]).map(tab => (
            <button
              key={tab}
              className={`ranking-tab${activeTab === tab ? ' active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tabLabels[tab]}
            </button>
          ))}
        </nav>

        {loading ? (
          <div className="ranking-loading">Chargement en cours…</div>
        ) : (
          <div className="ranking-table-wrapper">
            <table className="ranking-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Utilisateur</th>
                  <th>{tabLabels[activeTab]}</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((u, i) => (
                  <tr key={u.id}>
                    <td>{i + 1}</td>
                    <td>{u.username}</td>
                    <td>{keyMap[activeTab](u)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default RankingOverlay;
