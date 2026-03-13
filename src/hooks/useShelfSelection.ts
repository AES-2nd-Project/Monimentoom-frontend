import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../store';
import { addShelfItem, updateShelfItemImage } from '../store/shelfSlice';
import type { WallSide } from '../types/position';
import type { Bounds, Coordinate } from '../types/room';

const useShelfSelection = (wallSide: WallSide) => {
  const dispatch = useDispatch<AppDispatch>();
  const items = useSelector((state: RootState) =>
    wallSide === 'LEFT' ? state.shelf.leftItems : state.shelf.rightItems
  );

  const [dragStart, setDragStart] = useState<Coordinate | null>(null);
  const [dragCurrent, setDragCurrent] = useState<Coordinate | null>(null);
  const [selection, setSelection] = useState<Bounds | null>(null);

  const checkOverlap = (rect: Bounds) => {
    return items.some(
      item =>
        rect.r1 <= item.r2 &&
        rect.r2 >= item.r1 &&
        rect.c1 <= item.c2 &&
        rect.c2 >= item.c1
    );
  };

  const handleMouseEnter = (coord: Coordinate) => {
    if (dragStart) setDragCurrent(coord);
  };

  const handleMouseDown = (coord: Coordinate) => {
    if (selection) {
      const { r1, r2, c1, c2 } = selection;
      const isInsideSelection =
        coord.r >= r1 && coord.r <= r2 && coord.c >= c1 && coord.c <= c2;

      if (isInsideSelection) {
        setSelection(null);
        return;
      }
    }

    setSelection(null);
    setDragStart(coord);
    setDragCurrent(coord);
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

  // 인벤토리 드롭으로 영역 확정 + 이미지 등록
  const confirmSelectionWithImage = (goodsId: number, imageUrl: string) => {
    if (selection && !checkOverlap(selection)) {
      dispatch(
        addShelfItem({
          wallSide,
          item: { id: Date.now(), goodsId, imageSrc: imageUrl, ...selection },
        })
      );
      setSelection(null);
    }
  };

  // 이미지 없는 아이템에 드롭
  const setItemImage = (id: number, goodsId: number, imageUrl: string) => {
    dispatch(
      updateShelfItemImage({ wallSide, id, goodsId, imageSrc: imageUrl })
    );
  };

  const isCovered = (coord: Coordinate) =>
    items.some(
      item =>
        coord.r >= item.r1 &&
        coord.r <= item.r2 &&
        coord.c >= item.c1 &&
        coord.c <= item.c2
    );

  const isCoveredWithImage = (coord: Coordinate) =>
    items.some(
      item =>
        !!item.imageSrc &&
        coord.r >= item.r1 &&
        coord.r <= item.r2 &&
        coord.c >= item.c1 &&
        coord.c <= item.c2
    );

  // 미리보기 영역 계산
  const preview: Bounds | null =
    dragStart && dragCurrent
      ? {
          r1: Math.min(dragStart.r, dragCurrent.r),
          r2: Math.max(dragStart.r, dragCurrent.r),
          c1: Math.min(dragStart.c, dragCurrent.c),
          c2: Math.max(dragStart.c, dragCurrent.c),
        }
      : selection;

  const isPreviewOverlapping = preview ? checkOverlap(preview) : false;

  const isPreviewed = (coord: Coordinate) => {
    if (!preview) return false;
    return (
      coord.r >= preview.r1 &&
      coord.r <= preview.r2 &&
      coord.c >= preview.c1 &&
      coord.c <= preview.c2
    );
  };

  return {
    items,
    dragStart,
    selection,
    preview,
    isPreviewOverlapping,
    handleMouseDown,
    handleMouseEnter,
    handleMouseUp,
    isCovered,
    isCoveredWithImage,
    isPreviewed,
    clearSelection,
    confirmSelectionWithImage,
    setItemImage,
  };
};

export default useShelfSelection;
