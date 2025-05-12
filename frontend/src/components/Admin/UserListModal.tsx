import React from 'react';
import './UserListModal.css';
import { useAdminUsers } from '../../hooks/useAdminUsers';
import UserManagement from './UserManagement';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: number) => void;
}

const UserListModal: React.FC<Props> = ({ isOpen, onClose, onDelete }) => {
  const { users, loading, error } = useAdminUsers();

  if (!isOpen) return null;
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-full" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>Liste des utilisateurs</h2>
        <UserManagement
          users={users}
          loading={loading}
          error={error}
          onDelete={onDelete}
          onUpdate={(id) => alert(`Non implémenté (ID ${id})`)}
          onViewDino={() => alert('Utiliser le widget Dinosaure')}
        />
      </div>
    </div>
  );
};

export default UserListModal;