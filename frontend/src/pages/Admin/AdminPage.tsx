import React, { useState } from 'react';
import { useAdminUsers } from '../../hooks/useAdminUsers';
import { useLevelsXp } from '../../hooks/useLevelsXp';
import { useEpochThresholds } from '../../hooks/useEpochThresholds';
import { adminService } from '../../services/adminService';
import './AdminPage.css';
import Header from '../../components/Common/Header';
import Footer from '../../components/Common/Footer';
import SummaryCard from '../../components/Admin/SummaryCard';
import UserListModal from '../../components/Admin/UserListModal';
import ExportSettingsModal from '../../components/Admin/ExportSettingsModal';
import StatsModal from '../../components/Admin/StatsModal';

const AdminPage: React.FC = () => {
  // Hooks pour récupérer les données
  const { users, deleteUser } = useAdminUsers();
  const { data: levelsXp } = useLevelsXp();
  const { data: epochTh } = useEpochThresholds();

  // Modals state
  const [showUsers, setShowUsers] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [showXp, setShowXp] = useState(false);
  const [showEpoch, setShowEpoch] = useState(false);

  // Export direct sans modal
  const handleQuickExport = async () => {
    const weeks = 2;
    try {
      const blob = await adminService.exportUsers(weeks);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-last-${weeks}-weeks.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      alert('Erreur lors de l’export rapide.');
    }
  };

  return (
    <>
      <Header />

      <div className="content-wrapper">
        <div className="dashboard-grid">

          <SummaryCard
            title="Utilisateurs"
            subtitle={`${users.length} inscrits`}
            primaryLabel="Voir la liste"
            onPrimary={() => setShowUsers(true)}
          />

          <SummaryCard
            title="Export Utilisateurs"
            subtitle="Export JSON de la dernière période"
            primaryLabel="Réglages"
            onPrimary={() => setShowExport(true)}
            secondaryLabel="Export rapide"
            onSecondary={handleQuickExport}
          />

          <SummaryCard
            title="Niveaux & XP"
            subtitle={`${levelsXp.length} niveaux`}
            primaryLabel="Détails"
            onPrimary={() => setShowXp(true)}
          />

          <SummaryCard
            title="Époques & Seuils"
            subtitle={`${epochTh.length} époques`}
            primaryLabel="Détails"
            onPrimary={() => setShowEpoch(true)}
          />

        </div>
      </div>

      <Footer />

      {/* Modals */}
      <UserListModal
        isOpen={showUsers}
        onClose={() => setShowUsers(false)}
        onDelete={deleteUser}
      />

      <ExportSettingsModal
        isOpen={showExport}
        onClose={() => setShowExport(false)}
      />

      <StatsModal
        title="Table Niveaux & XP"
        isOpen={showXp}
        onClose={() => setShowXp(false)}
      />

      <StatsModal
        title="Table Époques & Seuils"
        isOpen={showEpoch}
        onClose={() => setShowEpoch(false)}
      />
    </>
  );
};

export default AdminPage;