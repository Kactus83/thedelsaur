import React, { useState } from 'react';
import { FaUserCog } from 'react-icons/fa'; 
import LoginForm from '../../components/Auth/LoginForm';
import SignupForm from '../../components/Auth/SignupForm';
import './HomePage.css'; // Assurez-vous que ce fichier CSS existe

const HomePage: React.FC = () => {
    const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
    const [isSignupOpen, setIsSignupOpen] = useState<boolean>(false);

    const openLogin = () => {
        setIsSignupOpen(false);
        setIsLoginOpen(true);
    };

    const openSignup = () => {
        setIsLoginOpen(false);
        setIsSignupOpen(true);
    };

    const closeForms = () => {
        setIsLoginOpen(false);
        setIsSignupOpen(false);
    };

    return (
        <div className="home-page">
            {/* Icône d'accès gestion utilisateurs */}
            <a href="/admin" className="user-management-icon" title="Gestion des utilisateurs">
                <FaUserCog />
            </a>

            {/* Bloc central */}
            <div className="central-block">
                <h1>🦖The IdleSaur🦖</h1>
                <br />
                <button className="btn-login" onClick={openLogin}><span>Se Connecter</span></button>
                <button className="btn-signup" onClick={openSignup}><span>S'inscrire</span></button>
            </div>

            {/* Overlay pour les formulaires */}
            <div className={`overlay ${isLoginOpen || isSignupOpen ? 'show' : ''}`}>
                {/* Formulaire de Connexion */}
                {isLoginOpen && <LoginForm onClose={closeForms} />}

                {/* Formulaire d'Inscription */}
                {isSignupOpen && <SignupForm onClose={closeForms} />}
            </div>
        </div>
    );
};

export default HomePage;