import api from './api'; 
import { User } from '../types/User';
import { Dinosaur } from '../types/Dinosaur'; 
import { LoginResponse } from '../types/Auth'; 

// Interface définissant les données nécessaires pour la connexion
interface LoginData {
    email: string;
    password: string;
}

// Interface définissant les données nécessaires pour l'inscription
interface SignupData {
    username: string;
    email: string;
    password: string;
}

// Fonction asynchrone pour gérer la connexion utilisateur
export const login = async (data: LoginData): Promise<LoginResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data as LoginResponse; 
};

// Fonction asynchrone pour gérer l'inscription utilisateur
export const signup = async (data: SignupData): Promise<User> => {
    const response = await api.post('/auth/signup', data); 
    return response.data as User; 
};

// Fonction asynchrone pour récupérer les informations de l'utilisateur depuis le backend
export const fetchUserFromBackend = async (): Promise<User> => {
    const response = await api.get('/users/my-profile');
    return response.data as User;
};

// Fonction asynchrone pour récupérer les informations des dinosaures depuis le backend
export const fetchDinosaurFromBackend = async (): Promise<Dinosaur> => {
    const response = await api.get('/dinosaurs/my-dinosaur'); 
    console.log(response.data);
    return response.data as Dinosaur;
};
