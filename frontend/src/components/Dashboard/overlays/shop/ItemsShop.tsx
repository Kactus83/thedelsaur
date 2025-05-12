import React, { useState } from 'react';
import './ShopOverlay.css';
import { DinosaurItemDTO } from '../../../../types/dinosaur-item.dto';
import { DinosaurItemInstanceDTO } from '../../../../types/dinosaur-item-instance.dto';
import ShopItemCard from './cards/ShopItemCard';

interface ItemsShopProps {
  items: DinosaurItemDTO[];
  itemInstances: DinosaurItemInstanceDTO[];
  dinosaurLevel: number;
  money: number;
  onPurchase: (itemId: number) => void;
}

const ItemsShop: React.FC<ItemsShopProps> = ({
  items,
  itemInstances,
  dinosaurLevel,
  money,
  onPurchase,
}) => {
  const [tab, setTab] = useState<'consommables' | 'persistants'>('consommables');
  const ownedIds = itemInstances.map(i => i.id);

  const consumables = items
    .filter(i => i.itemType === 'consumable')
    .sort((a, b) => a.price - b.price);
  const persistents = items
    .filter(i => i.itemType === 'persistent' && !ownedIds.includes(i.id))
    .sort((a, b) => a.price - b.price);

  const list = tab === 'consommables' ? consumables : persistents;

  return (
    <>
      <div className="shop-items-submenu">
        <nav className="shop-item-tabs">
          <button
            className={tab === 'consommables' ? 'active' : ''}
            onClick={() => setTab('consommables')}
          >
            Consommables
          </button>
          <button
            className={tab === 'persistants' ? 'active' : ''}
            onClick={() => setTab('persistants')}
          >
            Persistants
          </button>
        </nav>
      </div>
      <div className="shop-items">
        {list.map(item => {
          const isPreview = item.minLevelToBuy === dinosaurLevel + 1;
          const insufficient = !isPreview && money < item.price;
          const ownedQuantity =
            itemInstances.find(i => i.id === item.id)?.currentLevelOrQuantity || 0;
          return (
            <ShopItemCard
              key={item.id}
              item={item}
              onPurchase={onPurchase}
              onUpgrade={undefined}
              preview={isPreview}
              disabled={false}
              insufficientResources={insufficient}
              ownedQuantity={ownedQuantity}
            />
          );
        })}
      </div>
    </>
  );
};

export default ItemsShop;
