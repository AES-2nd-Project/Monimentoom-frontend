import clsx from 'clsx';
import { useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import useShelfSelection from '../../hooks/useShelfSelection';
import type { RootState } from '../../store';
import BackSlots from './BackSlots';
import Dividers from './Dividers';
import Preview from './Preview';
import ShelfItems from './ShelfItems';

interface ShelfProps {
  isLeft: boolean;
}

const Shelf = ({ isLeft }: ShelfProps) => {
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

  const isEditMode = useSelector((state: RootState) => state.shelf.isEditMode);

  // 편집 모드가 꺼질 때 선택/프리뷰 초기화
  const prevEditMode = useRef(isEditMode);
  useEffect(() => {
    if (prevEditMode.current && !isEditMode) {
      clearSelection();
    }
    prevEditMode.current = isEditMode;
  }, [isEditMode, clearSelection]);

  // 그리드 배열 생성 헬퍼
  const gridRows: Array<number> = Array.from({ length: 4 });
  const gridCols: Array<number> = Array.from({ length: 4 });
  const dividerRows: Array<number> = Array.from({ length: 3 });

  return (
    <div
      className={clsx(
        `shrink-0 bg-cover bg-center bg-no-repeat pt-15.5 pb-6 transition-all duration-700 ease-out transform-3d`,
        isEditMode
          ? "aspect-1208/1257 h-125 bg-[url('/src/assets/shelf_front.png')] px-14 pt-15 pb-21"
          : isLeft
            ? "aspect-1804/2040 h-100 bg-[url('/src/assets/shelf_side_left.png')] pl-17"
            : "aspect-1804/2040 h-100 bg-[url('/src/assets/shelf_side_right.png')] pr-17"
      )}
      style={{ perspective: '1000px' }}
    >
      <div
        className={clsx(
          `relative grid h-full w-full shrink-0 grid-cols-4 grid-rows-[1fr_auto_1fr_auto_1fr_auto_1fr] select-none`,
          isEditMode
            ? 'transform-[translateZ(0px)_rotateY(0deg)_rotateX(0deg)_scale(1.0)]'
            : isLeft
              ? 'transform-[translateZ(100px)_translateX(4px)_skewY(-13.8deg)_scale(0.7)]'
              : 'transform-[translateZ(100px)_translateX(-4px)_skewY(13.8deg)_scale(0.7)]'
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
        />

        {/* 2. 디바이더 */}
        <Dividers
          dividerRows={dividerRows}
          gridCols={gridCols}
          items={items}
          preview={preview}
          isPreviewOverlapping={isPreviewOverlapping}
          isPreviewed={isPreviewed}
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
        />
      </div>
    </div>
  );
};

export default Shelf;
