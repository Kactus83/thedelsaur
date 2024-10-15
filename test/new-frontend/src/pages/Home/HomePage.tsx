import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../../components/Auth/LoginForm';
import SignupForm from '../../components/Auth/SignupForm';
import './HomePage.css'; // Créez ce fichier si nécessaire

const HomePage: React.FC = () => {
    const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
    const [isSignupOpen, setIsSignupOpen] = useState<boolean>(false);
    const navigate = useNavigate();

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
            <a href="/admin" className="user-management-icon" title="Gestion des utilisateurs">
                <i className="fas fa-user-cog"></i>
            </a>

            <div className="central-block">
                <h1>🦖The IdleSaur🦖</h1>
                <br />
                <button className="btn-login" onClick={openLogin}><span>Se Connecter</span></button>
                <button className="btn-signup" onClick={openSignup}><span>S'inscrire</span></button>
            </div>

            {isLoginOpen && <LoginForm />}
            {isSignupOpen && <SignupForm />}
        </div>
    );
};

export default HomePage;