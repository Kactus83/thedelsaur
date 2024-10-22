export type DietType = 'carnivore' | 'herbivore' | 'omnivore';
export type EpochType = 'past' | 'present' | 'future';

export interface Dinosaur {
  id: number;
  name: string;
  diet: DietType;
  energy: number;
  max_energy: number;
  food: number;
  max_food: number;
  experience: number;
  epoch: EpochType;
  created_at: Date;
  last_update_by_time_service: string;
  isSleeping: boolean;
  isDead: boolean;
  user_id: number;
}