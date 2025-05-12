import api from './api';
import { User } from '../types/User';
import { Dinosaur } from '../types/Dinosaur';

interface LevelXp {
  level: number;
  xpRequired: number;
}

interface EpochThreshold {
  epoch: string;
  threshold: number;
}

export const adminService = {
  getUsers: (): Promise<User[]> =>
    api.get('/admin/users').then(res => res.data),

  deleteUser: (userId: number): Promise<void> =>
    api.delete(`/admin/users/${userId}`).then(() => {}),

  getLevelsXp: (): Promise<LevelXp[]> =>
    api.get('/admin/levels-xp-table').then(res => res.data),

  getEpochThresholds: (): Promise<EpochThreshold[]> =>
    api.get('/dinosaurs/epochs/thresholds').then(res => res.data.thresholds),

  getDinosaurs: (): Promise<Dinosaur[]> =>
    api.get('/admin/dinosaurs').then(res => res.data),

  exportUsers: (weeks: number): Promise<Blob> =>
    api.get(`/admin/users/export/last-weeks/${weeks}`, { responseType: 'blob' })
       .then(res => res.data),
};
