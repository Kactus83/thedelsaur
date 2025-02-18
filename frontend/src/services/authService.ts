import api from './api'; 
import { User } from '../types/User';
import { Dinosaur } from '../types/Dinosaur'; 
import { LoginResponse } from '../types/Auth'; 

// Interface définissant les données nécessaires pour la connexion
interface LoginData {
    email?: string;
    username?: string;
    password: string;
}

// Interface définissant les données nécessaires pour l'inscription
interface SignupData {
    username: string;
    email: string;
    password: string;
}

interface ResetPasswordData {
    email?: string;
    currentPassword: string;
    newPassword:string;
}

interface changeDinoNameData {
    name: string;
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
    console.log("Reponse du my-profile",response);
    return response.data as User;
};

// Fonction asynchrone pour récupérer les informations des dinosaures depuis le backend
export const fetchDinosaurFromBackend = async (): Promise<Dinosaur> => {
    const response = await api.get('/dinosaurs/my-dinosaur'); 
    return response.data as Dinosaur;
};

export const changeDinoName = async (data: changeDinoNameData): Promise<any> => {
    const response = await api.patch('/dinosaurs/my-dinosaur/change-name', data); 
    return response;
};

export const resetPassword = async (data: ResetPasswordData): Promise<any> => {
    const response = await api.post('/auth/reset-password', data); 
    return response;
};
