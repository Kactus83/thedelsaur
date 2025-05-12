import React from 'react';
import { DinosaurBuildingDTO } from '../../../../types/dinosaur-building.dto';
import { DinosaurBuildingInstanceDTO } from '../../../../types/dinosaur-building-instance.dto';
import ShopBuildingCard from './cards/ShopBuildingCard';
import './ShopOverlay.css';

interface BuildingsShopProps {
  buildings: DinosaurBuildingDTO[];
  buildingInstances: DinosaurBuildingInstanceDTO[];
  dinosaurLevel: number;
  money: number;
  onPurchase: (buildingId: number) => void;
}

const BuildingsShop: React.FC<BuildingsShopProps> = ({
  buildings,
  buildingInstances,
  dinosaurLevel,
  money,
  onPurchase,
}) => {
  const ownedIds = buildingInstances.map(b => b.id);

  // disponibles à acheter
  const available = buildings.filter(
    b => b.minLevelToBuy <= dinosaurLevel && !ownedIds.includes(b.id)
  );
  // à venir (preview)
  const preview = buildings.filter(
    b => b.minLevelToBuy === dinosaurLevel + 1
  );

  const list = [...available, ...preview].sort((a, b) => {
    if (a.minLevelToBuy !== b.minLevelToBuy) {
      return a.minLevelToBuy - b.minLevelToBuy;
    }
    return a.price - b.price;
  });

  return (
    <div className="shop-items">
      {list.map(building => {
        const isPreview = building.minLevelToBuy === dinosaurLevel + 1;
        const insufficient = !isPreview && money < building.price;
        return (
          <ShopBuildingCard
            key={building.id}
            building={building}
            onPurchase={onPurchase}
            preview={isPreview}
            disabled={false}
            insufficientResources={insufficient}
          />
        );
      })}
    </div>
  );
};

export default BuildingsShop;
