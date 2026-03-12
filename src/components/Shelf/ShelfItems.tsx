import clsx from 'clsx';
import { useState } from 'react';
import type { Item } from '../../types/room';
import { getItemGridCoord } from './shelfUtils';

interface ShelfItemsProps {
  items: Item[];
  setItemImage: (id: number, imageSrc: string) => void;
}

const ShelfItem = ({
  item,
  setItemImage,
}: {
  item: Item;
  setItemImage: (id: number, imageSrc: string) => void;
}) => {
  const [isDragOver, setIsDragOver] = useState(false);

  if (item.imageSrc) {
    return (
      <div
        style={getItemGridCoord(item)}
        className={`pointer-events-none z-20 mx-2 overflow-hidden rounded-lg`}
      >
        <img
          src={item.imageSrc}
          alt='shelf item'
          className={`h-full w-full object-contain`}
          draggable={false}
        />
      </div>
    );
  }

  return (
    <div
      style={getItemGridCoord(item)}
      className={clsx(
        `z-20 mx-2 flex items-center justify-center rounded-lg border-2 border-dashed transition-colors`,
        isDragOver
          ? `border-point-green bg-point-green/20`
          : `border-secondary/50 bg-secondary/10`
      )}
      onDragOver={e => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={e => {
        e.preventDefault();
        const src = e.dataTransfer.getData('inventory-image');
        if (src) setItemImage(item.id, src);
        setIsDragOver(false);
      }}
    />
  );
};

const ShelfItems = ({ items, setItemImage }: ShelfItemsProps) => {
  return (
    <>
      {items.map(item => (
        <ShelfItem key={item.id} item={item} setItemImage={setItemImage} />
      ))}
    </>
  );
};

export default ShelfItems;
