import React, { useState, useEffect } from 'react';
import { login } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css'; 
import { LoginResponse } from '../../types/Auth';

interface LoginFormProps {
    onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {
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
            const data: LoginResponse = await login({ email, password });
            localStorage.setItem('token', data.token);
            setMessage({ type: 'success', text: 'Connexion réussie !' });
            navigate('/dashboard');
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || 'Erreur de connexion. Veuillez réessayer.';
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
            <h2>Se Connecter</h2>
            {message && <div className={`message ${message.type} show`}>{message.text}</div>}
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