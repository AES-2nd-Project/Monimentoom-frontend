import clsx from 'clsx';
import React, { useState } from 'react';
import divider from '../../assets/divider.png';

// ==========================================
// 1. 타입 정의
// ==========================================
export interface Coordinate {
  r: number;
  c: number;
}

export interface Bounds {
  r1: number;
  r2: number;
  c1: number;
  c2: number;
}

export interface Item extends Bounds {
  id: number;
}

interface PreviewBounds {
  minR: number;
  maxR: number;
  minC: number;
  maxC: number;
}

// ==========================================
// 2. 비즈니스 로직 분리 (Custom Hook)
// ==========================================
const useShelfSelection = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [dragStart, setDragStart] = useState<Coordinate | null>(null);
  const [dragCurrent, setDragCurrent] = useState<Coordinate | null>(null);
  const [selection, setSelection] = useState<Bounds | null>(null);

  const checkOverlap = (r1: number, r2: number, c1: number, c2: number) => {
    return items.some(
      item => r1 <= item.r2 && r2 >= item.r1 && c1 <= item.c2 && c2 >= item.c1
    );
  };

  const handleMouseDown = (r: number, c: number) => {
    if (selection) {
      const { r1, r2, c1, c2 } = selection;
      const isInsideSelection = r >= r1 && r <= r2 && c >= c1 && c <= c2;

      if (isInsideSelection) {
        if (!checkOverlap(r1, r2, c1, c2)) {
          setItems([...items, { id: Date.now(), r1, r2, c1, c2 }]);
        }
        setSelection(null);
        return;
      }
    }

    setSelection(null);
    setDragStart({ r, c });
    setDragCurrent({ r, c });
  };

  const handleMouseEnter = (r: number, c: number) => {
    if (dragStart) setDragCurrent({ r, c });
  };

  const handleMouseUp = () => {
    if (dragStart) {
      const current = dragCurrent || dragStart;
      setSelection({
        r1: Math.min(dragStart.r, current.r),
        r2: Math.max(dragStart.r, current.r),
        c1: Math.min(dragStart.c, current.c),
        c2: Math.max(dragStart.c, current.c),
      });
    }
    setDragStart(null);
    setDragCurrent(null);
  };

  const clearSelection = () => {
    setSelection(null);
    setDragStart(null);
    setDragCurrent(null);
  };

  const isCovered = (r: number, c: number) =>
    items.some(
      item => r >= item.r1 && r <= item.r2 && c >= item.c1 && c <= item.c2
    );

  // 미리보기 영역 계산
  let previewBounds: PreviewBounds | null = null;
  let isPreviewOverlapping = false;

  if (dragStart && dragCurrent) {
    previewBounds = {
      minR: Math.min(dragStart.r, dragCurrent.r),
      maxR: Math.max(dragStart.r, dragCurrent.r),
      minC: Math.min(dragStart.c, dragCurrent.c),
      maxC: Math.max(dragStart.c, dragCurrent.c),
    };
  } else if (selection) {
    previewBounds = {
      minR: selection.r1,
      maxR: selection.r2,
      minC: selection.c1,
      maxC: selection.c2,
    };
  }

  if (previewBounds) {
    isPreviewOverlapping = checkOverlap(
      previewBounds.minR,
      previewBounds.maxR,
      previewBounds.minC,
      previewBounds.maxC
    );
  }

  const isPreviewed = (r: number, c: number) => {
    if (!previewBounds) return false;
    return (
      r >= previewBounds.minR &&
      r <= previewBounds.maxR &&
      c >= previewBounds.minC &&
      c <= previewBounds.maxC
    );
  };

  return {
    items,
    dragStart,
    selection,
    previewBounds,
    isPreviewOverlapping,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    isCovered,
    isPreviewed,
    clearSelection,
  };
};

// ==========================================
// 3. 메인 컴포넌트
// ==========================================
const ShelfTest = () => {
  const {
    items,
    dragStart,
    selection,
    previewBounds,
    isPreviewOverlapping,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    isCovered,
    isPreviewed,
    clearSelection,
  } = useShelfSelection();

  // 그리드 배열 생성 헬퍼
  const gridRows = Array.from({ length: 4 });
  const gridCols = Array.from({ length: 4 });
  const dividerRows = Array.from({ length: 3 });

  return (
    <div
      className="relative grid h-130 w-125 shrink-0 grid-cols-4 grid-rows-[1fr_auto_1fr_auto_1fr_auto_1fr] bg-[url('/src/assets/shelf_front.png')] bg-cover bg-center bg-no-repeat px-14 pt-15 pb-21 select-none"
      onMouseLeave={handleMouseUp}
      onMouseUp={handleMouseUp}
    >
      {/* 1. 배경 빈 슬롯 */}
      {gridRows.map((_, r) =>
        gridCols.map((_, c) => {
          const hideVisuals = isCovered(r, c) || isPreviewed(r, c);

          return (
            <div
              key={`bg-${r}-${c}`}
              onMouseDown={() => handleMouseDown(r, c)}
              onMouseEnter={() => handleMouseEnter(r, c)}
              style={{
                // row는 divider가 끼어 있기 때문에 2배씩 건너뜀
                gridRowStart: r * 2 + 1,
                gridRowEnd: r * 2 + 2,
                gridColumnStart: c + 1,
                gridColumnEnd: c + 2,
              }}
              className={clsx(
                'group z-10 mx-2 flex shrink-0 cursor-pointer items-center justify-center rounded-lg text-center transition-colors duration-200',
                !hideVisuals &&
                  'border-border hover:bg-card-background border-2 border-dashed bg-transparent hover:border-transparent'
              )}
            >
              {!hideVisuals && (
                <span className='text-purple-white group-hover:text-purple-black pointer-events-none transition-colors duration-200'>
                  +
                </span>
              )}
            </div>
          );
        })
      )}

      {/* 2. 디바이더 */}
      {dividerRows.map((_, r) =>
        gridCols.map((_, c) => {
          const coveringItem = items.find(
            item => r >= item.r1 && r <= item.r2 && c >= item.c1 && c <= item.c2
          );
          const spansAcrossItem = coveringItem && coveringItem.r2 > r;

          const isPreviewCovering = isPreviewed(r, c);
          const spansAcrossPreview =
            previewBounds && isPreviewCovering && previewBounds.maxR > r;

          const showDivider =
            (coveringItem && !spansAcrossItem) ||
            (isPreviewCovering && !spansAcrossPreview && !isPreviewOverlapping);

          return (
            <div
              key={`divider-${r}-${c}`}
              style={{
                gridRowStart: r * 2 + 2,
                gridRowEnd: r * 2 + 3,
                gridColumnStart: c + 1,
                gridColumnEnd: c + 2,
              }}
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
          style={{
            gridRowStart: item.r1 * 2 + 1,
            gridRowEnd: item.r2 * 2 + 2,
            gridColumnStart: item.c1 + 1,
            gridColumnEnd: item.c2 + 2,
          }}
          className='pointer-events-none z-20 mx-2 flex items-center justify-center rounded-lg bg-gray-300 shadow-md'
        >
          {item.c2 - item.c1 + 1} x {item.r2 - item.r1 + 1}
        </div>
      ))}

      {/* 4. 드래그 및 대기 중 미리보기 박스 */}
      {previewBounds && (
        <div
          style={{
            gridRowStart: previewBounds.minR * 2 + 1,
            gridRowEnd: previewBounds.maxR * 2 + 2,
            gridColumnStart: previewBounds.minC + 1,
            gridColumnEnd: previewBounds.maxC + 2,
          }}
          className={clsx(
            'pointer-events-none relative z-30 mx-2 flex items-center justify-center rounded-lg border-2 shadow-md transition-all',
            isPreviewOverlapping
              ? 'border-red-500 bg-red-400 text-red-900'
              : 'border-blue-500 bg-blue-300 text-blue-900',
            !dragStart && selection && !isPreviewOverlapping && 'animate-pulse'
          )}
        >
          {previewBounds.maxC - previewBounds.minC + 1} x{' '}
          {previewBounds.maxR - previewBounds.minR + 1}
          {/* 깜빡거리는 선택 대기 상태일 때만 우상단에 X 버튼 표시 */}
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
