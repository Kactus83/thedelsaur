import React from 'react';
import './StatsModal.css';
import LevelXpTable from './LevelXpTable';
import EpochThresholdTable from './EpochThresholdTable';
import { useLevelsXp } from '../../hooks/useLevelsXp';
import { useEpochThresholds } from '../../hooks/useEpochThresholds';

interface Props {
  title: string;
  isOpen: boolean;
  onClose: () => void;
}

const StatsModal: React.FC<Props> = ({ title, isOpen, onClose }) => {
  const { data: xpData, loading: xpLoading, error: xpError } = useLevelsXp();
  const { data: epData, loading: epLoading, error: epError } = useEpochThresholds();

  if (!isOpen) return null;

  const isXp = title.includes('Niveaux');

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-full" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>{title}</h2>
        {isXp
          ? <LevelXpTable data={xpData} loading={xpLoading} error={xpError} />
          : <EpochThresholdTable data={epData} loading={epLoading} error={epError} />
        }
      </div>
    </div>
  );
};

export default StatsModal;