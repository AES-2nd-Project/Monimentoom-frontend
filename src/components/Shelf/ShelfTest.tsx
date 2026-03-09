import clsx from 'clsx';
import divider from '../../assets/divider.png';
import useShelfSelection from '../../hooks/useShelfSelection';
import type { Bounds, Coordinate } from '../../types/room';
import BackSlots from './BackSlots';

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
  const dividerRows = Array.from({ length: 3 });

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
                c === 0 && '-ml-7.5',
                c === 3 && '-mr-7.25'
              )}
            >
              {showDivider && (
                <img
                  src={divider}
                  alt='divider'
                  className='pointer-events-none h-full w-full object-fill'
                />
              )}
            </div>
          );
        })
      )}

      {/* 3. 등록된 아이템 */}
      {items.map(item => (
        <div
          key={item.id}
          style={getItemGridCoord(item)}
          className='pointer-events-none z-20 mx-2 flex items-center justify-center rounded-lg bg-gray-300 shadow-md'
        >
          {item.c2 - item.c1 + 1} x {item.r2 - item.r1 + 1}
        </div>
      ))}

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
