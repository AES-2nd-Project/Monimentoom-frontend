import clsx from 'clsx';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import type { Coordinate } from '../../types/room';
import { getItemGridCoord } from './shelfUtils';

interface BackSlotsProps {
  gridRows: Array<number>;
  gridCols: Array<number>;
  handleMouseDown: (coord: Coordinate) => void;
  handleMouseEnter: (coord: Coordinate) => void;
  isCovered: (coord: Coordinate) => boolean;
  isCoveredWithImage: (coord: Coordinate) => boolean;
  isPreviewed: (coord: Coordinate) => boolean;
}

const BackSlots = ({
  gridRows,
  gridCols,
  handleMouseDown,
  handleMouseEnter,
  isCovered,
  isCoveredWithImage,
  isPreviewed,
}: BackSlotsProps) => {
  const isEditMode = useSelector((state: RootState) => state.shelf.isEditMode);
  return (
    <>
      {gridRows.map((_, r) =>
        gridCols.map((_, c) => {
          const hasImage = isCoveredWithImage({ r, c });
          const hideVisuals =
            !isEditMode || isCovered({ r, c }) || isPreviewed({ r, c });

          return (
            <div
              key={`bg-${r}-${c}`}
              data-r={r}
              data-c={c}
              onMouseDown={() => handleMouseDown({ r, c })}
              onMouseEnter={() => handleMouseEnter({ r, c })}
              onTouchStart={() => handleMouseDown({ r, c })}
              style={getItemGridCoord({ r1: r, r2: r, c1: c, c2: c })}
              className={clsx(
                'group z-10 mx-2 flex shrink-0 cursor-pointer items-center justify-center rounded-lg text-center transition-colors duration-200',
                !isEditMode || hasImage
                  ? 'pointer-events-none'
                  : 'border-border hover:bg-card-background border-2 border-dashed bg-transparent hover:border-transparent'
              )}
            >
              {!hideVisuals && (
                <span
                  className={`text-purple-white group-hover:text-purple-black pointer-events-none transition-colors duration-200`}
                >
                  +
                </span>
              )}
            </div>
          );
        })
      )}
    </>
  );
};

export default BackSlots;
