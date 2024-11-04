import React, { useEffect, useState } from 'react';
import Header from '../../components/Common/Header';
import Footer from '../../components/Common/Footer';
import { fetchDinosaurFromBackend,fetchUserFromBackend } from '../../services/authService';
import DinosaurInfo from '../../components/Dashboard/DinosaurInfo';
import { User } from '../../types/User';
import { Dinosaur } from '../../types/Dinosaur';
import './UserProfilePage.css';


const UserProfilePage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [dinosaur, setDinosaur] = useState<Dinosaur | null>(null);

    const initializeUser = async () => {
        try {
            const fetchedUser = await fetchUserFromBackend();
            const fetchedDinosaur = await fetchDinosaurFromBackend();
            setUser(fetchedUser);
            setDinosaur(fetchedDinosaur);
        } catch (error) {
            console.error('Erreur lors de la récupération des informations utilisateur :', error);
        }

    };


    const handleEditName = () => {
        console.log("Modifier le nom du dinosaure");
        // Logique de modification du nom à implémenter
    };

    useEffect(() => {
        initializeUser();
    }, []);

    return (
        <>
            
            <div id="main2">
                <Header />
                <div className="user-profile-page">
                    <div className="user-info">
                        <h2>Profil Utilisateur</h2>
                        <hr />
                        {user ? (
                            <div className="user-details">
                                <p><strong>ID:</strong> {user.id}</p>
                                <p><strong>Nom d'utilisateur:</strong> {user.username}</p> 
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Date de création:</strong> {new Date(user.created_at).toLocaleDateString()}</p>
                                <hr />
                                <form className="password-change-form">
                                    <h3>Changer le mot de passe</h3>
                                    <label>
                                    <p>Ancien mot de passe : </p>
                                    <input 
                                        type="password" 
                                        required 
                                    />
                                </label>
                                <label>
                                    <p>Nouveau mot de passe : </p> 
                                    <input 
                                        type="password" 
                                        required 
                                    />
                                </label>
                                <label>
                                    <p>Confirmer le nouveau mot de passe : </p> 
                                    <input 
                                        type="password" 
                                        required 
                                    />
                                </label> 
                                <br />
                                <button type="submit">Modifier le mot de passe</button>
                            </form>
                            </div>
                        
                        ) : (
                            <p>Chargement des informations...</p>
                        )}
                    </div>
                    <div className="dino-info">
                    <h2>Dinosaure</h2>
                    <p><strong>Nom du Dinosaure : </strong> {dinosaur?.name}</p>
                        <button onClick={handleEditName}>Modifier le nom</button>
                    </div>
                </div>
              <Footer />
            </div>

        </>
    );
};

export default UserProfilePage;
