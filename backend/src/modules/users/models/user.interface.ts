export interface User {
    id: number;
    username: string;
    email: string;
    neutral_sould_points: number;
    dark_sould_points: number;
    bright_sould_points: number;
    password_hash: string; 
    isAdmin: boolean;
    created_at: Date;
  }