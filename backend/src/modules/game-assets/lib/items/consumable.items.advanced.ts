import { DinosaurItemDTO } from '../../models/dinosaur-item.dto';
import { DinosaurItemType, DinosaurItemCategory } from '../../models/dinosaur-item.enums';

/**
 * Items consommables pour la catégorie "Advanced"
 * Ces items offrent des boosts temporaires pour vos productions d'armes, armures, amis et employés.
 * À consommer sans modération pour des résultats explosifs !
 */
export const consumableAdvancedItems: DinosaurItemDTO[] = [
  {
    id: 0,
    name: "Élixir d'Armes",
    description: "Un élixir puissant qui augmente temporairement la production d'armes. Parfait pour les batailles décisives !",
    price: 1000,
    minLevelToBuy: 1,
    itemType: DinosaurItemType.Consumable,
    category: DinosaurItemCategory.Advanced,
    levels: []
  },
  {
    id: 0,
    name: "Tonique d'Armures",
    description: "Un tonique spécial qui booste temporairement la production d'armures. Pour une défense qui en jette !",
    price: 1000,
    minLevelToBuy: 1,
    itemType: DinosaurItemType.Consumable,
    category: DinosaurItemCategory.Advanced,
    levels: []
  },
  {
    id: 0,
    name: "Potion d'Amitié",
    description: "Une potion rare qui augmente temporairement la production d'amis. Parce que l'amitié, c'est magique !",
    price: 5000,
    minLevelToBuy: 1,
    itemType: DinosaurItemType.Consumable,
    category: DinosaurItemCategory.Advanced,
    levels: []
  },
  {
    id: 0,
    name: "Booster d'Employés",
    description: "Un booster qui stimule temporairement l'efficacité de vos employés. Donnez un coup de fouet à votre équipe !",
    price: 5000,
    minLevelToBuy: 1,
    itemType: DinosaurItemType.Consumable,
    category: DinosaurItemCategory.Advanced,
    levels: []
  }
];
