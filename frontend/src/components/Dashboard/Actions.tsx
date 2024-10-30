import * as React from 'react';
import './Actions.css';
import api from '../../services/api';

export interface ActionDetail {
  name: string;
  description: string;
  canPerform: boolean;
  endpoint: string;
  image: string;
}

interface ActionsProps {
  refreshDinosaur: () => void;
  availableActions: ActionDetail[];
  onActionEvent: (eventMessage: string) => void; // Callback pour envoyer les messages d'événements
}

const Actions: React.FC<ActionsProps> = ({ refreshDinosaur, availableActions, onActionEvent }) => {

  /**
   * Fonction pour gérer l'action dynamique
   */
  const handleAction = async (action: ActionDetail) => {
    try {
      const response = await api.post(action.endpoint); // Appel à l'API pour effectuer l'action
      console.log(response);
      if (response.status === 200) {
        const { event } = response.data;
        onActionEvent(event?.description || `Action réussie: ${action.name}`); // Passe le message d'event à onActionEvent
        refreshDinosaur(); // Rafraîchir les données du dinosaure après l'action
      } else {
        throw new Error('Échec de l\'action');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Erreur interne du serveur.';
      onActionEvent(`Erreur lors de l'action ${action.name}: ${errorMessage}`);
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
