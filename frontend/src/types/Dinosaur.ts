export interface Dinosaur {
    id: number;
    name: string;
    level: number;
    diet: 'carnivore' | 'herbivore' | 'omnivore';
    energy: number;
    max_energy: number;
    food: number;
    max_food: number;
    experience: number;
    hunger: number;
    max_hunger: number;
    epoch: string;
    created_at: string;
    last_reborn: string;
    last_update_by_time_service: string;
    isSleeping: boolean;
    isDead: boolean;
    user_id: number;
}