import { Exclude, Expose, Type } from 'class-transformer';
import { DietType } from './dinosaur-diet.type';
import { EpochType } from './epoch.type';
import { DinosaurMultiplierDTO } from './dinosaur-multiplier.dto';
import { DinosaurType } from './dinosaur-type.type';

@Exclude()
export class DinosaurDTO {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @Expose()
  diet!: DietType;

  @Expose()
  type!: DinosaurType;

  @Expose()
  energy!: number;

  @Expose()
  max_energy!: number;

  @Expose()
  food!: number;

  @Expose()
  max_food!: number;

  @Expose()
  hunger!: number;

  @Expose()
  max_hunger!: number;

  @Expose()
  experience!: number;

  @Expose()
  level!: number;

  @Expose()
  epoch!: EpochType;

  @Expose()
  created_at!: Date;

  @Expose()
  last_reborn!: string;

  @Expose()
  karma!: number;

  @Expose()
  reborn_amount!: number;

  @Expose()
  last_update_by_time_service!: string;

  @Expose()
  isSleeping!: boolean;

  @Expose()
  isDead!: boolean;

  @Expose()
  user_id!: number;

  @Expose()
  multipliers!: DinosaurMultiplierDTO;  
}
