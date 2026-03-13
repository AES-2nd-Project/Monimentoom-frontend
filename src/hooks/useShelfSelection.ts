import { useEffect, useRef, useState } from 'react';
import type { Bounds, Coordinate, Item } from '../types/room';

const useShelfSelection = (initialItems: Item[] = []) => {
  const [items, setItems] = useState<Item[]>(initialItems);
  const [dragStart, setDragStart] = useState<Coordinate | null>(null);
  const [dragCurrent, setDragCurrent] = useState<Coordinate | null>(null);
  const [selection, setSelection] = useState<Bounds | null>(null);

  // initialItems가 처음 로드됐을 때 한 번만 반영
  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current && initialItems.length > 0) {
      initialized.current = true;
      setItems(initialItems);
    }
  }, [initialItems]);

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
        // 클릭만으로는 아이템 등록 안 함 — 인벤토리에서 이미지 드롭해야 확정
        setSelection(null);
        return;
      }
    }

    // 새로운 마우스 입력 시 선택 초기화 후 드래그 시작
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

    // 마우스 뗐을 때 기존 드래그 값들 초기화
    setDragStart(null);
    setDragCurrent(null);
  };

  const clearSelection = () => {
    setSelection(null);
    setDragStart(null);
    setDragCurrent(null);
  };

  // 인벤토리에서 드래그 앤 드롭으로 영역 확정 + 이미지 등록
  const confirmSelectionWithImage = (goodsId: number, imageUrl: string) => {
    if (selection && !checkOverlap(selection)) {
      setItems(prev => [
        ...prev,
        { id: Date.now(), goodsId, imageSrc: imageUrl, ...selection },
      ]);
      setSelection(null);
    }
  };

  // 이미 확정된 아이템에 goodsId + 이미지 설정
  const setItemImage = (id: number, goodsId: number, imageUrl: string) => {
    setItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, goodsId, imageSrc: imageUrl } : item
      )
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

  // 이미지가 등록된 아이템이 차지하는 셀
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
  let preview: Bounds | null =
    dragStart && dragCurrent
      ? {
          r1: Math.min(dragStart.r, dragCurrent.r),
          r2: Math.max(dragStart.r, dragCurrent.r),
          c1: Math.min(dragStart.c, dragCurrent.c),
          c2: Math.max(dragStart.c, dragCurrent.c),
        }
      : selection;

  let isPreviewOverlapping = false;

  if (preview) {
    isPreviewOverlapping = checkOverlap(preview);
  }

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
