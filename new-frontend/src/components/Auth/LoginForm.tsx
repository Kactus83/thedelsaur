import React, { useState, useEffect } from 'react';
import { login } from '../../services/authService'; 
import { useNavigate } from 'react-router-dom';
import './LoginForm.css'; 
import { LoginResponse } from '../../types/Auth';

// Interface définissant les propriétés attendues par le composant LoginForm
interface LoginFormProps {
    onClose: () => void; // Fonction pour fermer le formulaire
}

// Définition du composant fonctionnel LoginForm
const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {
    // États pour gérer les champs du formulaire et les messages
    const [email, setEmail] = useState<string>(''); // Email
    const [password, setPassword] = useState<string>(''); // Mot de passe
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null); // Message de succès ou d'erreur
    const [show, setShow] = useState<boolean>(false); // État pour gérer l'animation d'apparition
    const navigate = useNavigate(); // Hook pour la navigation

    // Effet déclenché au montage du composant pour ajouter la classe 'show'
    useEffect(() => {
        setShow(true);
    }, []);

    // Fonction appelée lors de la soumission du formulaire
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault(); // Empêche le comportement par défaut du formulaire
        try {
            console.log("submit login");
            // Appel au service de connexion avec les données du formulaire
            const data: LoginResponse = await login({ email, password });
            // Stockage du token JWT dans le localStorage
            localStorage.setItem('token', data.token);
            console.log("token received : ", data.token);
            // Mise à jour du message de succès
            setMessage({ type: 'success', text: 'Connexion réussie !' });
            // Redirection vers la page du tableau de bord
            navigate('/dashboard');
        } catch (error: any) {
            // Gestion des erreurs et affichage d'un message d'erreur approprié
            const errorMsg = error.response?.data?.message || 'Erreur de connexion. Veuillez réessayer.';
            setMessage({ type: 'error', text: errorMsg });
        }
    };

    // Fonction pour fermer le formulaire avec une animation
    const handleClose = () => {
        setShow(false);
        // Attente de la fin de la transition CSS avant d'appeler la fonction onClose
        setTimeout(() => {
            onClose();
        }, 500); // Durée correspondant à la transition CSS définie dans LoginForm.css
    };

    return (
        <div className={`form-container ${show ? 'show' : ''}`}>
            {/* Bouton pour fermer le formulaire */}
            <button className="close-btn" onClick={handleClose}>×</button>
            <h2>Se Connecter</h2>
            {/* Affichage conditionnel du message de succès ou d'erreur */}
            {message && <div className={`message ${message.type} show`}>{message.text}</div>}
            {/* Formulaire de connexion */}
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    id="login-email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    id="login-password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="btn-submit">Connexion</button>
            </form>
        </div>
    );
};

export default LoginForm;
