import React from 'react';
import './EpochThresholdTable.css';

interface EpochThreshold {
  epoch: string;
  threshold: number;
}

interface Props {
  data: EpochThreshold[];
  loading: boolean;
  error: string | null;
}

const EpochThresholdTable: React.FC<Props> = ({ data, loading, error }) => {
  if (loading) return <p>Chargement des époques…</p>;
  if (error) return <p className="error">Erreur : {error}</p>;

  return (
    <div className="epoch-threshold-table">
      <table>
        <thead>
          <tr>
            <th>Époque</th>
            <th>Durée (s)</th>
            <th>Seuil cumulé (s)</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const prev = i > 0 ? data[i - 1].threshold : 0;
            const duration = row.threshold - prev;
            return (
              <tr key={row.epoch}>
                <td>{row.epoch}</td>
                <td>{duration.toFixed(2)}</td>
                <td>{row.threshold.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default EpochThresholdTable;
