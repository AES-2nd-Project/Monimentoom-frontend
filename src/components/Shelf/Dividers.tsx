import clsx from 'clsx';
import { useSelector } from 'react-redux';
import divider from '../../assets/divider.png';
import type { RootState } from '../../store';
import type { Bounds, Coordinate, Item } from '../../types/room';
import { getDividerGridCoord } from './shelfUtils';

interface DividersProps {
  dividerRows: Array<number>;
  gridCols: Array<number>;
  items: Item[];
  preview: Bounds | null;
  isPreviewOverlapping: boolean;
  isPreviewed: (coord: Coordinate) => boolean;
}

const Dividers = ({
  dividerRows,
  gridCols,
  items,
  preview,
  isPreviewOverlapping,
  isPreviewed,
}: DividersProps) => {
  const isEditMode = useSelector((state: RootState) => state.shelf.isEditMode);
  return (
    <>
      {dividerRows.map((_, r) =>
        gridCols.map((_, c) => {
          const coveringItem = items.find(
            item => r >= item.r1 && r <= item.r2 && c >= item.c1 && c <= item.c2
          );
          const spansAcrossItem = coveringItem && coveringItem.r2 > r;

          const isPreviewCovering = isPreviewed({ r, c });
          const spansAcrossPreview =
            preview && isPreviewCovering && preview.r2 > r;

          const showDivider =
            (coveringItem && !spansAcrossItem) ||
            (isPreviewCovering && !spansAcrossPreview && !isPreviewOverlapping);

          return (
            <div
              key={`divider-${r}-${c}`}
              style={getDividerGridCoord({ r, c })}
              className={clsx(
                'flex h-4 items-start justify-center',
                c === 0 && (isEditMode ? '-ml-7.5' : '-ml-1.5'),
                c === 3 && (isEditMode ? '-mr-7.25' : '-mr-px')
              )}
            >
              {showDivider && (
                <img
                  src={divider}
                  alt='divider'
                  className={`pointer-events-none h-full w-full object-fill`}
                />
              )}
            </div>
          );
        })
      )}
    </>
  );
};

export default Dividers;
