import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { Exclude, Expose } from 'class-transformer';

// DTO pour les données renvoyées au frontend
@Exclude()
export class UserDTO {
  @Expose()
  id!: number;

  @Expose()
  username!: string;

  @Expose()
  email!: string;

  @Expose()
  neutral_soul_points!: number;

  @Expose()
  dark_soul_points!: number;

  @Expose()
  bright_soul_points!: number;

  @Expose()
  created_at!: Date;
}