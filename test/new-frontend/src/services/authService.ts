import api from './api';
import { User } from '../types/User';

interface LoginData {
    email: string;
    password: string;
}

interface SignupData {
    username: string;
    email: string;
    password: string;
}

export const login = async (data: LoginData) => {
    const response = await api.post('/auth/login', data);
    return response.data;
};

export const signup = async (data: SignupData) => {
    const response = await api.post('/auth/signup', data);
    return response.data;
};

export const fetchUserFromBackend = async (): Promise<User> => {
    const response = await api.get('/users/my-profile');
    return response.data;
};