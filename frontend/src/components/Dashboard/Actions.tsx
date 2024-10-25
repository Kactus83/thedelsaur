import * as React from 'react';
import { fetchDinosaurActions } from '../../services/dinosaurService';
import './Actions.css';
import api from '../../services/api';

interface ActionDetail {
  name: string;
  description: string;
  canPerform: boolean;
  endpoint: string;
  image: string;
}

interface ActionsProps {
  refreshDinosaur: () => void;
}

const Actions: React.FC<ActionsProps> = ({ refreshDinosaur }) => {
  const [availableActions, setAvailableActions] = React.useState<ActionDetail[]>([]);

  /**
   * Fonction pour récupérer les actions disponibles depuis le backend
   */
  const fetchActions = async () => {
    try {
      const data = await fetchDinosaurActions(); // Récupère les actions disponibles
      setAvailableActions(data.availableActions); // Met à jour les actions disponibles
      console.log('Actions disponibles : ', data.availableActions);
    } catch (error: any) {
      alert(`Erreur lors de la récupération des actions: ${error.response?.data?.message || 'Erreur interne du serveur.'}`);
    }
  };

  // Récupérer les actions dès le montage du composant
  React.useEffect(() => {
    fetchActions();
  }, []);

  /**
   * Fonction pour gérer l'action dynamique
   */
  const handleAction = async (action: ActionDetail) => {
    try {
      const response = await api.post(action.endpoint); // Appel à l'API pour effectuer l'action
      if (response.status === 200) {
        alert(`Action réussie: ${action.name}`);
        refreshDinosaur(); // Rafraîchir les données du dinosaure après l'action
        fetchActions(); // Rafraîchir les actions après l'action
      } else {
        throw new Error('Échec de l\'action');
      }
    } catch (error: any) {
      alert(`Erreur lors de l'action ${action.name}: ${error.message}`);
    }
  };

  return (
    <div className="actions">
      {availableActions.map((action) => (
        action.canPerform && (
          <button key={action.name} onClick={() => handleAction(action)}>
            <img src={action.image} alt={action.name} className="action-image" />
            {action.name}
          </button>
        )
      ))}
    </div>
  );
};

export default Actions;
