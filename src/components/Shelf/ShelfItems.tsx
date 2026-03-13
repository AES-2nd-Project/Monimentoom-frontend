import clsx from 'clsx';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import type { Item } from '../../types/room';
import { getItemGridCoord } from './shelfUtils';

interface ShelfItemsProps {
  items: Item[];
  setItemImage: (id: number, goodsId: number, imageUrl: string) => void;
  removeItem: (id: number) => void;
}

const ShelfItem = ({
  item,
  setItemImage,
  removeItem,
}: {
  item: Item;
  setItemImage: (id: number, goodsId: number, imageUrl: string) => void;
  removeItem: (id: number) => void;
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const isEditMode = useSelector((state: RootState) => state.shelf.isEditMode);

  if (item.imageSrc) {
    return (
      <div
        style={getItemGridCoord(item)}
        className={`relative z-20 mx-2 overflow-hidden rounded-lg`}
        onMouseEnter={() => isEditMode && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <img
          src={item.imageSrc}
          alt='shelf item'
          className={`pointer-events-none h-full w-full object-contain`}
          draggable={false}
        />
        {isEditMode && isHovered && (
          <button
            onClick={e => {
              e.stopPropagation();
              removeItem(item.id);
            }}
            className={`bg-point-pink text-purple-white hover:bg-point-pink/80 pointer-events-auto absolute top-1 right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-xs shadow transition-colors`}
          >
            ✕
          </button>
        )}
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
        const raw = e.dataTransfer.getData('inventory-goods');
        if (raw) {
          try {
            const { goodsId, imageUrl } = JSON.parse(raw);
            if (typeof goodsId === 'number' && typeof imageUrl === 'string') {
              setItemImage(item.id, goodsId, imageUrl);
            }
          } catch {
            // 앱 외부에서 드롭된 잘못된 데이터 무시
          }
        }
        setIsDragOver(false);
      }}
    />
  );
};

const ShelfItems = ({ items, setItemImage, removeItem }: ShelfItemsProps) => {
  return (
    <>
      {items.map(item => (
        <ShelfItem
          key={item.id}
          item={item}
          setItemImage={setItemImage}
          removeItem={removeItem}
        />
      ))}
    </>
  );
};

export default ShelfItems;
