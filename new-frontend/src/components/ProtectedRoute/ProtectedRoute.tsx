import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthGuard from '../../guards/useAuthGuard';

// Composant pour les routes protégées
const ProtectedRoute: React.FC<{ children: JSX.Element }> = ({ children }) => {
  useAuthGuard(); // Appel du guard pour vérifier la validité du token
  const token = localStorage.getItem('token'); // Vérification de la présence du token

  return token ? children : <Navigate to="/" />;
};

export default ProtectedRoute;