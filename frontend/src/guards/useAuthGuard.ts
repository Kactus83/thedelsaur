import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const useAuthGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');

    const checkTokenValidity = async () => {
      if (!token) {
        navigate('/'); // Redirection vers l'accueil si aucun token
        return;
      }

      try {
        // Appel à la route de vérification du token
        await api.post('/auth/verify-token');
      } catch (error) {
        // Si une erreur survient (ex: token expiré), on supprime le token et redirige vers l'accueil
        localStorage.removeItem('token');
        navigate('/');
      }
    };

    checkTokenValidity();
  }, [navigate]);
};

export default useAuthGuard;
