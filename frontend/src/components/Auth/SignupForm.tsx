import React, { useState, useEffect } from 'react';
import { signup } from '../../services/authService'; 
import { useNavigate } from 'react-router-dom';
import './SignupForm.css'; 

// Interface définissant les propriétés attendues par le composant SignupForm
interface SignupFormProps {
    onClose: () => void; // Fonction pour fermer le formulaire
}

// Définition du composant fonctionnel SignupForm
const SignupForm: React.FC<SignupFormProps> = ({ onClose }) => {
    // États pour gérer les champs du formulaire et les messages
    const [username, setUsername] = useState<string>(''); // Nom d'utilisateur
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
            // Appel au service d'inscription avec les données du formulaire
            const data = await signup({ username, email, password });
            // Mise à jour du message de succès
            setMessage({ type: 'success', text: 'Inscription réussie ! Vous pouvez maintenant vous connecter.' });
            // Fermeture du formulaire après 2 secondes
            setTimeout(() => {
                handleClose();
            }, 2000);
        } catch (error: any) {
            // Gestion des erreurs et affichage d'un message d'erreur approprié
            const errorMsg = error.response?.data?.message || 'Erreur d\'inscription. Veuillez réessayer.';
            setMessage({ type: 'error', text: errorMsg });
        }
    };

    // Fonction pour fermer le formulaire avec une animation
    const handleClose = () => {
        setShow(false);
        // Attente de la fin de la transition CSS avant d'appeler la fonction onClose
        setTimeout(() => {
            onClose();
        }, 500); // Durée correspondant à la transition CSS définie dans SignupForm.css
    };

    return (
        <div className={`form-container ${show ? 'show' : ''}`}>
            {/* Bouton pour fermer le formulaire */}
            <button className="close-btn" onClick={handleClose}>×</button>
            <h2>S'inscrire</h2>
            {/* Affichage conditionnel du message de succès ou d'erreur */}
            {message && <div className={`message ${message.type} show`}>{message.text}</div>}
            {/* Formulaire d'inscription */}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    id="signup-username"
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    id="signup-email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    id="signup-password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit" className="btn-submit">S'inscrire</button>
            </form>
        </div>
    );
};

export default SignupForm;
