import clsx from 'clsx';
import { useSelector } from 'react-redux';
import useShelfSelection from '../../hooks/useShelfSelection';
import type { RootState } from '../../store/shelfSlice';
import BackSlots from './BackSlots';
import Dividers from './Dividers';
import Preview from './Preview';
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

  const isShrinked = useSelector((state: RootState) => state.shelf.isShrinked);

  // 그리드 배열 생성 헬퍼
  const gridRows: Array<number> = Array.from({ length: 4 });
  const gridCols: Array<number> = Array.from({ length: 4 });
  const dividerRows: Array<number> = Array.from({ length: 3 });

  return (
    <div
      className={clsx(
        `bg-no-repeattransition-all shrink-0 bg-cover bg-center duration-700 ease-out transform-3d`,
        isShrinked
          ? "aspect-1804/2040 h-100 bg-[url('/src/assets/shelf_side.png')] pt-15.5 pr-17 pb-6"
          : "aspect-1208/1257 h-125 bg-[url('/src/assets/shelf_front.png')] px-14 pt-15 pb-21"
      )}
      style={{ perspective: '1000px' }}
    >
      <div
        className={clsx(
          `relative grid h-full w-full shrink-0 grid-cols-4 grid-rows-[1fr_auto_1fr_auto_1fr_auto_1fr] select-none`,
          isShrinked
            ? 'transform-[translateZ(100px)_translateX(-4px)_skewY(13.8deg)_scale(0.7)]'
            : 'transform-[translateZ(0px)_rotateY(0deg)_rotateX(0deg)_scale(1.0)]'
        )}
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
          isShrinked={isShrinked}
        />

        {/* 2. 디바이더 */}
        <Dividers
          dividerRows={dividerRows}
          gridCols={gridCols}
          items={items}
          preview={preview}
          isPreviewOverlapping={isPreviewOverlapping}
          isPreviewed={isPreviewed}
          isShrinked={isShrinked}
        />

        {/* 3. 등록된 아이템 */}
        <ShelfItems items={items} />

        {/* 4. 드래그 및 대기 중 미리보기 박스 */}
        <Preview
          preview={preview}
          isPreviewOverlapping={isPreviewOverlapping}
          dragStart={dragStart}
          selection={selection}
          clearSelection={clearSelection}
          isShrinked={isShrinked}
        />
      </div>
    </div>
  );
};

export default ShelfTest;
