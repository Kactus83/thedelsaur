import React from 'react';
import './UserManagement.css';
import { User } from '../../types/User';

interface Props {
  users: User[];
  loading: boolean;
  error: string | null;
  onDelete: (id: number) => void;
  onUpdate: (id: number) => void;
  onViewDino: (id: number) => void;
}

const UserManagement: React.FC<Props> = ({
  users, loading, error, onDelete, onUpdate, onViewDino
}) => {
  if (loading) return <p>Chargement des utilisateurs…</p>;
  if (error) return <p className="error">Erreur : {error}</p>;
  if (users.length === 0) return <p>Aucun utilisateur trouvé.</p>;

  return (
    <div className="user-management">
      <table className="user-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Créé le</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{new Date(u.created_at).toLocaleDateString()}</td>
              <td>
                <button
                  type="button"
                  className="delete"
                  aria-label="Supprimer"
                  onClick={() => onDelete(u.id)}
                >🗑️</button>
                <button
                  type="button"
                  className="update"
                  aria-label="Modifier"
                  onClick={() => onUpdate(u.id)}
                >✏️</button>
                <button
                  type="button"
                  className="view-dino"
                  aria-label="Voir dinosaure"
                  onClick={() => onViewDino(u.id)}
                >🦖</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserManagement;
