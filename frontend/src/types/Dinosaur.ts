export interface Dinosaur {
    id: number;
    name: string;
    level: number;
    diet: 'carnivore' | 'herbivore' | 'omnivore';
    type: 'land' | 'air' | 'sea';  
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
    karma: number;
    last_update_by_time_service: string;
    reborn_amount: number; 
    isSleeping: boolean;
    isDead: boolean;
    user_id: number;

    multipliers: {
        earn_herbi_food_multiplier: number;
        earn_carni_food_multiplier: number;
        earn_food_multiplier: number;
        earn_energy_multiplier: number;
        earn_experience_multiplier: number;
        max_energy_multiplier: number;
        max_food_multiplier: number;
    };
}
