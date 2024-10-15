import React from 'react';
import { User } from '../../types/User';
import './UserInfo.css';

interface UserInfoProps {
    user: User;
}

const UserInfo: React.FC<UserInfoProps> = ({ user }) => {
    return (
        <div className="user-info">
            <h3>Utilisateur :</h3>
            <p>Nom d'utilisateur : {user.username}</p>
            <p>Email : {user.email}</p>
            <p>Date de création : {new Date(user.created_at).toLocaleDateString()}</p>
        </div>
    );
};

export default UserInfo;