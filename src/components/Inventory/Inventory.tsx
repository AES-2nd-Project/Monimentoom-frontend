import clsx from 'clsx';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';

const Inventory = () => {
  const isEditMode = useSelector((state: RootState) => state.shelf.isEditMode);
  return (
    <div
      className={clsx(
        `flex w-full flex-row flex-nowrap gap-12 overflow-x-auto transition-all duration-700 [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`,
        isEditMode
          ? 'mt-6 h-60 opacity-100'
          : 'pointer-events-none h-0 opacity-0'
      )}
    >
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className='bg-card-background h-full w-60 shrink-0 rounded-lg'
        />
      ))}
    </div>
  );
};

export default Inventory;
