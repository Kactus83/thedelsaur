import React from 'react';
import './LevelXpTable.css';

interface LevelXp {
  level: number;
  xpRequired: number;
}

interface Props {
  data: LevelXp[];
  loading: boolean;
  error: string | null;
}

const LevelXpTable: React.FC<Props> = ({ data, loading, error }) => {
  if (loading) return <p>Chargement des niveaux…</p>;
  if (error) return <p className="error">Erreur : {error}</p>;

  return (
    <div className="level-xp-table">
      <table>
        <thead>
          <tr>
            <th>Niveau</th>
            <th>XP requis</th>
          </tr>
        </thead>
        <tbody>
          {data.map(row => (
            <tr key={row.level}>
              <td>{row.level}</td>
              <td>{row.xpRequired}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LevelXpTable;
