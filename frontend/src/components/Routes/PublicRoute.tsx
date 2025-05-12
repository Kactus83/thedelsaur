import React from 'react';
import useUnauthGuard from '../../guards/useUnauthGuard';

interface PublicRouteProps {
  children: JSX.Element;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  useUnauthGuard();
  return children;
};

export default PublicRoute;