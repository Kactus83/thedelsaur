import React, { useState, useEffect } from 'react';
import { signup } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import './SignupForm.css'; 

interface SignupFormProps {
    onClose: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onClose }) => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [show, setShow] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Ajouter la classe 'show' pour déclencher l'animation
        setShow(true);
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await signup({ username, email, password });
            setMessage({ type: 'success', text: 'Inscription réussie ! Vous pouvez maintenant vous connecter.' });
            setTimeout(() => {
                handleClose(); // Fermer le formulaire d'inscription
            }, 2000);
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || 'Erreur d\'inscription. Veuillez réessayer.';
            setMessage({ type: 'error', text: errorMsg });
        }
    };

    const handleClose = () => {
        setShow(false);
        // Attendre la fin de la transition avant de fermer
        setTimeout(() => {
            onClose();
        }, 500); // Durée correspondante à la transition CSS
    };

    return (
        <div className={`form-container ${show ? 'show' : ''}`}>
            <button className="close-btn" onClick={handleClose}>×</button>
            <h2>S'inscrire</h2>
            {message && <div className={`message ${message.type} show`}>{message.text}</div>}
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