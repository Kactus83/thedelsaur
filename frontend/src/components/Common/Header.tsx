import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useOverlay } from '../../contexts/OverlayContext';
import './Header.css';

const HandleLogout = () => {
  localStorage.removeItem('token');
};

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { openOverlay } = useOverlay();

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header>
      <div className="Title">IdleSaur🦖</div>

      {/* Hamburger icon */}
      <div className={`burger-icon ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
        <span></span>
        <span></span>
        <span></span>
      </div>

      {/* Navigation menu */}
      <nav className={menuOpen ? 'nav open' : 'nav'}>
        <Link to="/dashboard" onClick={toggleMenu}>Dashboard</Link>
        <Link to="/user-profile" onClick={toggleMenu}>Profil</Link>
        <button onClick={() => { HandleLogout(); toggleMenu(); }}>Disconnect</button>
        
        {/* Boutons pour déclencher les overlays */}
        <button onClick={() => { openOverlay('inventory'); toggleMenu(); }}>
          Inventaire
        </button>
        <button onClick={() => { openOverlay('buildings'); toggleMenu(); }}>
          Bâtiments
        </button>
        <button onClick={() => { openOverlay('shop'); toggleMenu(); }}>
          Shop
        </button>
      </nav>
    </header>
  );
};

export default Header;
