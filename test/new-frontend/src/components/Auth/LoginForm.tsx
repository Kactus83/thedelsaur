import React, { useState } from 'react';
import { login } from '../../services/authService';
import { useNavigate } from 'react-router-dom';
import './LoginForm.css'; 
import { LoginResponse } from '../../types/Auth';

const LoginForm: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const navigate = useNavigate();

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

    return (
        <div className="form-container">
            <button className="close-btn" onClick={() => navigate('/')}>×</button>
            <h2>Se Connecter</h2>
            {message && <div className={`message ${message.type}`}>{message.text}</div>}
            <form onSubmit={handleSubmit}>
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
                <button type="submit" className="btn-submit">Connexion</button>
            </form>
        </div>
    );
};

export default LoginForm;