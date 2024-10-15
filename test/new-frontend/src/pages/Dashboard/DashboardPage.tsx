import React, { useEffect, useState } from 'react';
import { fetchUserFromBackend, fetchDinosaurFromBackend } from '../../services/authService';
import UserInfo from '../../components/Dashboard/UserInfo';
import DinosaurInfo from '../../components/Dashboard/DinosaurInfo';
import Actions from '../../components/Dashboard/Actions';
import Header from '../../components/Common/Header';
import Footer from '../../components/Common/Footer';
import './DashboardPage.css'; // Créez ce fichier si nécessaire

import { User } from '../../types/User';
import { Dinosaur } from '../../types/Dinosaur';

const DashboardPage: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [dinosaur, setDinosaur] = useState<Dinosaur | null>(null);

    const initializePage = async () => {
        try {
            const fetchedUser = await fetchUserFromBackend();
            const fetchedDinosaur = await fetchDinosaurFromBackend();
            setUser(fetchedUser);
            setDinosaur(fetchedDinosaur);
        } catch (error) {
            console.error('Erreur lors de l\'initialisation de la page :', error);
            // Optionnel : Rediriger vers la page d'accueil si une erreur survient
        }
    };

    useEffect(() => {
        initializePage();
    }, []);

    const refreshDinosaur = async () => {
        try {
            const updatedDinosaur = await fetchDinosaurFromBackend();
            setDinosaur(updatedDinosaur);
        } catch (error) {
            console.error('Erreur lors de la mise à jour des données du dinosaure :', error);
        }
    };

    return (
        <>
            <Header />
            <div id="main">
                <div id="Infos">
                    {user && <UserInfo user={user} />}
                    {dinosaur && <DinosaurInfo dinosaur={dinosaur} />}
                </div>
                <div id="Middle">
                    <div className="Title">
                        IdleSaur🦖
                    </div>
                    <div className="topMiddle">
                        {/* XP BAR : a cr'éer */}
                        <div className="xp-bar">
                            <div className="xp-progress" style={{ width: `${(dinosaur?.experience || 0) / 100}%` }}></div>
                        </div>
                    </div>
                    <div className="bottomMiddle">
                        <div className="middleContent">
                            {/* Image du dino */}
                            {dinosaur && (
                                <img
                                    src={`/assets/dino/dino_${dinosaur.diet}.svg`}
                                    alt={`Dinosaure ${dinosaur.name}`}
                                    className="dino-svg"
                                />
                            )}
                        </div>
                    </div>
                </div>
                <div id="Actions">
                    {dinosaur && <Actions dinosaur={dinosaur} refreshDinosaur={refreshDinosaur} />}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default DashboardPage;