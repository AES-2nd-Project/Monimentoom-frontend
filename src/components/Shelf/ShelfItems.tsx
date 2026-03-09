import type { Bounds, Item } from '../../types/room';

interface ShelfItemsProps {
  items: Item[];
  getItemGridCoord: (bounds: Bounds) => React.CSSProperties;
}

const ShelfItems = ({ items, getItemGridCoord }: ShelfItemsProps) => {
  return (
    <>
      {items.map(item => (
        <div
          key={item.id}
          style={getItemGridCoord(item)}
          className='pointer-events-none z-20 mx-2 flex items-center justify-center rounded-lg bg-gray-300 shadow-md'
        >
          {item.c2 - item.c1 + 1} x {item.r2 - item.r1 + 1}
        </div>
      ))}
    </>
  );
};

export default ShelfItems;
