import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import AdminPage from './pages/Admin/AdminPage';
import UserProfilePage from './pages/UserProfile/UserProfilePage';
import { OverlayProvider } from './contexts/OverlayContext';
import PublicRoute from './components/Routes/PublicRoute';
import ProtectedRoute from './components/Routes/ProtectedRoute';

const App: React.FC = () => (
  <Routes>
    {/* Page d'accueil : si token valide → redirige vers /dashboard */}
    <Route
      path="/"
      element={
        <PublicRoute>
          <HomePage />
        </PublicRoute>
      }
    />

    {/* Routes protégées identiques */}
    <Route
      path="/dashboard"
      element={
        <ProtectedRoute>
          <OverlayProvider>
            <DashboardPage />
          </OverlayProvider>
        </ProtectedRoute>
      }
    />
    <Route
      path="/admin"
      element={
        <ProtectedRoute>
          <OverlayProvider>
            <AdminPage />
          </OverlayProvider>
        </ProtectedRoute>
      }
    />
    <Route
      path="/user-profile"
      element={
        <ProtectedRoute>
          <OverlayProvider>
            <UserProfilePage />
          </OverlayProvider>
        </ProtectedRoute>
      }
    />

    {/* Toute autre route → accueil (et donc re-guard via PublicRoute) */}
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;