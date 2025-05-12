import React from 'react';
import './ExportSettingsModal.css';
import ExportControls from './ExportControls';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

const ExportSettingsModal: React.FC<Props> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-full" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>Paramètres d’export</h2>
        <p>Sélectionnez la période pour exporter les utilisateurs actifs.</p>
        <ExportControls onExport={() => { onClose(); }} />
      </div>
    </div>
  );
};

export default ExportSettingsModal;