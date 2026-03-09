import type { Item } from '../../types/room';
import { getItemGridCoord } from './shelfUtils';

interface ShelfItemsProps {
  items: Item[];
}

const ShelfItems = ({ items }: ShelfItemsProps) => {
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
