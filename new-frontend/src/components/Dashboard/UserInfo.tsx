import React from 'react';
// Importation du type User pour la typage des propriétés
import { User } from '../../types/User';
// Importation du fichier CSS spécifique au composant UserInfo
import './UserInfo.css';

// Interface définissant les propriétés attendues par le composant UserInfo
interface UserInfoProps {
    user: User; // Objet utilisateur contenant les informations à afficher
}

// Définition du composant fonctionnel UserInfo
const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
    return (
        <div className="user-info">
            <h3>Utilisateur :</h3>
            <p>Nom d'utilisateur : {user.username}</p>
            <p>Email : {user.email}</p>
            {/* Conversion de la date de création en format lisible */}
            <p>Date de création : {new Date(user.created_at).toLocaleDateString()}</p>
        </div>
    );
};

export default UserInfo;
