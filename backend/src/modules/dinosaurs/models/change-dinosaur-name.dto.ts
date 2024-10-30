import { IsString } from 'class-validator';

// DTO pour la requête de changement de nom du dinosaure
export class ChangeDinosaurNameRequestBody   {
  @IsString()
  name!: string;
}