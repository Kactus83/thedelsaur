import React, { useEffect, useState } from 'react';
import Header from '../../components/Common/Header';
import Footer from '../../components/Common/Footer';
import { fetchUserFromBackend } from '../../services/authService';
import { User } from '../../types/User';
import './UserProfilePage.css'; // Créez ce fichier si nécessaire

const UserProfilePage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    const initializeUser = async () => {
        try {
            const fetchedUser = await fetchUserFromBackend();
            setUser(fetchedUser);
        } catch (error) {
            console.error('Erreur lors de la récupération des informations utilisateur :', error);
        }
    };

    useEffect(() => {
        initializeUser();
    }, []);

    return (
        <>
            <Header />
            <div className="user-profile-page">
                <h2>Profil Utilisateur</h2>
                {user ? (
                    <div className="user-details">
                        <p><strong>ID:</strong> {user.id}</p>
                        <p><strong>Nom d'utilisateur:</strong> {user.username}</p>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Date de création:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                    </div>
                ) : (
                    <p>Chargement des informations...</p>
                )}
            </div>
            <Footer />
        </>
    );
};

export default UserProfilePage;