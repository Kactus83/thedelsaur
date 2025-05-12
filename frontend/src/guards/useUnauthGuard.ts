import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const useUnauthGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      // pas de token → on reste sur l'accueil
      return;
    }

    // token présent → on vérifie sa validité côté API
    const verify = async () => {
      try {
        await api.post('/auth/verify-token');
        // token valide → on redirige vers le dashboard
        navigate('/dashboard', { replace: true });
      } catch (err) {
        // token invalide/expiré → on le supprime et on ne fait rien
        localStorage.removeItem('token');
      }
    };

    verify();
  }, [navigate]);
};

export default useUnauthGuard;
