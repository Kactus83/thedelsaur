import api from './api';

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