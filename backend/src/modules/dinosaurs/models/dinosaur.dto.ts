import { Exclude, Expose } from 'class-transformer';
import { DietType } from './dinosaur-diet.type';
import { EpochType } from './epoch.type';

@Exclude()
export class DinosaurDTO {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  @Expose()
  diet!: DietType;

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
  epoch!: EpochType;

  @Expose()
  created_at!: Date;

  @Expose()
  last_update_by_time_service!: Date;

  @Expose()
  isSleeping!: boolean;

  @Expose()
  isDead!: boolean;

  @Expose()
  user_id!: number;
}