import { User } from "./User";

export interface LoginResponse {
    token: string;
}

export interface SignupResponse {
    user: User;
}