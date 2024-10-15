import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/Home/HomePage';
import DashboardPage from './pages/Dashboard/DashboardPage';
import AdminPage from './pages/Admin/AdminPage';
import UserProfilePage from './pages/UserProfile/UserProfilePage';

const App: React.FC = () => {
    const isAuthenticated = !!localStorage.getItem('token');

    return (
        <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/dashboard" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/" />} />
            <Route path="/admin" element={isAuthenticated ? <AdminPage /> : <Navigate to="/" />} />
            <Route path="/user-profile" element={isAuthenticated ? <UserProfilePage /> : <Navigate to="/" />} />
            {/* Redirection pour les routes non définies */}
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
};

export default App;