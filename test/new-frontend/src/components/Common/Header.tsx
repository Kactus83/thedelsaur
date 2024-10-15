import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; 

const Header: React.FC = () => {
    return (
        <header>
            <h1>🦖The IdleSaur🦖</h1>
            <nav>
                <Link to="/">Accueil</Link>
                <Link to="/dashboard">Dashboard</Link>
                <Link to="/admin">Admin</Link>
                <Link to="/user-profile">Profil</Link>
            </nav>
        </header>
    );
};

export default Header;