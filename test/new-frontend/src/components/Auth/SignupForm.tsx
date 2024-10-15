import React, { useState } from 'react';
import { signup } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import './SignupForm.css'; 

const SignupForm: React.FC = () => {
    const [username, setUsername] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const data = await signup({ username, email, password });
            setMessage({ type: 'success', text: 'Inscription réussie ! Vous pouvez maintenant vous connecter.' });
            setTimeout(() => {
                navigate('/dashboard'); // Vous pouvez rediriger vers la page de login si nécessaire
            }, 2000);
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || 'Erreur d\'inscription. Veuillez réessayer.';
            setMessage({ type: 'error', text: errorMsg });
        }
    };

    return (
        <div className="form-container">
            <button className="close-btn" onClick={() => navigate('/')}>×</button>
            <h2>S'inscrire</h2>
            {message && <div className={`message ${message.type}`}>{message.text}</div>}
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    placeholder="Nom d'utilisateur"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
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