import { Exclude, Expose } from 'class-transformer';
import { StatModifier } from '../../dinosaurs/models/stats-modifiers.types';

/**
 * Énumération des types de soul points requis pour l'achat.
 */
export enum SoulType {
  Neutral = 'neutral',
  Bright = 'bright',
  Dark = 'dark'
}

/**
 * DTO de définition d'une soul skill pour le module Game-Assets.
 * Ces skills représentent des améliorations persistantes entre vies,
 * achetables uniquement avec les soul points (neutral, bright ou dark).
 */
@Exclude()
export class DinosaurSoulSkillDTO {
  @Expose() id!: number;
  @Expose() name!: string;
  @Expose() description?: string;
  @Expose() price!: number;
  @Expose() soulType!: SoulType;
  @Expose() tier!: number;
  @Expose() statModifiers!: StatModifier[];
}
