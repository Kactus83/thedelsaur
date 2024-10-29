import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class DinosaurMultiplierDTO {
  @Expose()
  earn_herbi_food_multiplier!: number;

  @Expose()
  earn_carni_food_multiplier!: number;

  @Expose()
  earn_food_multiplier!: number;

  @Expose()
  earn_energy_multiplier!: number;

  @Expose()
  earn_experience_multiplier!: number;

  @Expose()
  max_energy_multiplier!: number;

  @Expose()
  max_food_multiplier!: number;
}
