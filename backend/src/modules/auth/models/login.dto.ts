import { IsEmail, IsNotEmpty } from 'class-validator';

// DTO pour la requête de login
export class LoginDto {
  @IsEmail()
  email!: string;

  @IsNotEmpty()
  password!: string;
}