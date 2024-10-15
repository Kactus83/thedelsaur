import api from './api';

export const fetchDinosaur = async () => {
    const response = await api.get('/dinosaurs/my-dinosaur');
    return response.data;
};

export const eatDinosaur = async () => {
    const response = await api.post('/dinosaurs/actions/eat');
    return response.data;
};

export const sleepDinosaur = async () => {
    const response = await api.post('/dinosaurs/actions/sleep');
    return response.data;
};

export const wakeDinosaur = async () => {
    const response = await api.post('/dinosaurs/actions/wake');
    return response.data;
};

export const resurrectDinosaur = async () => {
    const response = await api.post('/dinosaurs/actions/resurrect');
    return response.data;
};