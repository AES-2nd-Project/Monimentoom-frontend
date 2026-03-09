import clsx from 'clsx';
import useShelfSelection from '../../hooks/useShelfSelection';
import type { Bounds, Coordinate } from '../../types/room';
import BackSlots from './BackSlots';
import Dividers from './Dividers';
import ShelfItems from './ShelfItems';

const ShelfTest = () => {
  const {
    items,
    dragStart,
    selection,
    preview,
    isPreviewOverlapping,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    isCovered,
    isPreviewed,
    clearSelection,
  } = useShelfSelection();

  // 그리드 배열 생성 헬퍼
  const gridRows: Array<number> = Array.from({ length: 4 });
  const gridCols: Array<number> = Array.from({ length: 4 });
  const dividerRows: Array<number> = Array.from({ length: 3 });

  const getItemGridCoord = ({ r1, r2 = r1, c1, c2 = c1 }: Bounds) => ({
    // row는 divider가 끼어 있기 때문에 2배씩 건너뜀
    gridRowStart: r1 * 2 + 1,
    gridRowEnd: r2 * 2 + 2,
    gridColumnStart: c1 + 1,
    gridColumnEnd: c2 + 2,
  });

  const getDividerGridCoord = ({ r, c }: Coordinate) => ({
    gridRowStart: r * 2 + 2,
    gridRowEnd: r * 2 + 3,
    gridColumnStart: c + 1,
    gridColumnEnd: c + 2,
  });

  return (
    <div
      className="relative grid h-130 w-125 shrink-0 grid-cols-4 grid-rows-[1fr_auto_1fr_auto_1fr_auto_1fr] bg-[url('/src/assets/shelf_front.png')] bg-cover bg-center bg-no-repeat px-14 pt-15 pb-21 select-none"
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
    >
      {/* 1. 배경 빈 슬롯 */}
      <BackSlots
        gridRows={gridRows}
        gridCols={gridCols}
        handleMouseDown={handleMouseDown}
        handleMouseEnter={handleMouseEnter}
        isCovered={isCovered}
        isPreviewed={isPreviewed}
        getItemGridCoord={getItemGridCoord}
      />

      {/* 2. 디바이더 */}
      <Dividers
        dividerRows={dividerRows}
        gridCols={gridCols}
        items={items}
        preview={preview}
        isPreviewOverlapping={isPreviewOverlapping}
        isPreviewed={isPreviewed}
        getDividerGridCoord={getDividerGridCoord}
      />

      {/* 3. 등록된 아이템 */}
      <ShelfItems items={items} getItemGridCoord={getItemGridCoord} />

      {/* 4. 드래그 및 대기 중 미리보기 박스 */}
      {preview && (
        <div
          style={getItemGridCoord(preview)}
          className={clsx(
            'pointer-events-none relative z-30 mx-2 flex items-center justify-center rounded-lg border-2 shadow-md transition-all',
            isPreviewOverlapping
              ? 'border-red-500 bg-red-400 text-red-900'
              : 'border-blue-500 bg-blue-300 text-blue-900',
            !dragStart && selection && !isPreviewOverlapping && 'animate-pulse'
          )}
        >
          {preview.c2 - preview.c1 + 1} x {preview.r2 - preview.r1 + 1}
          {/* 선택 대기 상태일 때만 우상단에 X 버튼 표시 */}
          {!dragStart && selection && (
            <button
              onClick={e => {
                e.stopPropagation();
                clearSelection();
              }}
              className='pointer-events-auto absolute -top-2 -right-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-500 text-xs text-white shadow hover:bg-red-600'
            >
              ✕
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ShelfTest;
