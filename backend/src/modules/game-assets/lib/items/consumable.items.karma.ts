import { DinosaurItemDTO } from '../../models/dinosaur-item.dto';
import { DinosaurItemType, DinosaurItemCategory } from '../../models/dinosaur-item.enums';

/**
 * Items consommables pour la catégorie Karma
 */
export const consommablesKarmaItems: DinosaurItemDTO[] = [
  {
    id: 0,
    name: "Amulette Bénie",
    description: "Accorde un bonus temporaire de karma.",
    price: 250,
    minLevelToBuy: 1,
    itemType: DinosaurItemType.Consumable,
    category: DinosaurItemCategory.Karma,
    levels: []
  }
];
