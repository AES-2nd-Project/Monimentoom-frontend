import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import type { Item } from '../../types/room';
import GoodsDetailOverlay from './GoodsDetailOverlay';
import { getItemGridCoord } from './shelfUtils';

// 현재 터치 드래그 오버 중인 슬롯 전역 추적
let currentTouchDragoverItemId: number | null = null;
const touchDragHoverClearMap = new Map<number, () => void>();

// document touchend 리스너를 슬롯 수만큼 중복 등록하지 않도록 공유 관리
const touchEndHandlers = new Set<() => void>();
let isDocumentTouchEndAttached = false;

const handleDocumentTouchEnd = () => {
  touchEndHandlers.forEach(handler => {
    try {
      handler();
    } catch {
      /* 개별 슬롯 에러가 다른 슬롯에 영향 주지 않도록 */
    }
  });
};

const ensureDocumentTouchEnd = () => {
  if (isDocumentTouchEndAttached) return;
  document.addEventListener('touchend', handleDocumentTouchEnd);
  document.addEventListener('touchcancel', handleDocumentTouchEnd); // 터치 강제 취소 시에도 하이라이트 해제
  isDocumentTouchEndAttached = true;
};

const cleanupDocumentTouchEndIfEmpty = () => {
  if (isDocumentTouchEndAttached && touchEndHandlers.size === 0) {
    document.removeEventListener('touchend', handleDocumentTouchEnd);
    document.removeEventListener('touchcancel', handleDocumentTouchEnd);
    isDocumentTouchEndAttached = false;
  }
};

interface ShelfItemsProps {
  items: Item[];
  setItemImage: (id: number, goodsId: number, imageUrl: string) => void;
  removeItem: (id: number) => void;
}

const ShelfItem = ({
  item,
  setItemImage,
  removeItem,
  isEditMode,
  onItemClick,
}: {
  item: Item;
  setItemImage: (id: number, goodsId: number, imageUrl: string) => void;
  removeItem: (id: number) => void;
  isEditMode: boolean;
  onItemClick: (item: Item, rect: DOMRect) => void;
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const itemRef = useRef<HTMLDivElement>(null);
  const slotRef = useRef<HTMLDivElement>(null);

  // 훅은 항상 최상단에서 호출 (Rules of Hooks)
  // 이미지가 있는 슬롯엔 적용 안 함 — effect 내부에서 조기 return
  useEffect(() => {
    if (item.imageSrc) return;
    const el = slotRef.current;
    if (!el) return;

    const clearThisSlot = () => {
      setIsDragOver(false);
      if (currentTouchDragoverItemId === item.id)
        currentTouchDragoverItemId = null;
    };
    touchDragHoverClearMap.set(item.id, clearThisSlot);

    const onTouchDragOver = () => {
      // 이전 슬롯이 다르면 해제
      if (
        currentTouchDragoverItemId !== null &&
        currentTouchDragoverItemId !== item.id
      ) {
        touchDragHoverClearMap.get(currentTouchDragoverItemId)?.();
      }
      currentTouchDragoverItemId = item.id;
      setIsDragOver(true);
    };
    const onTouchDrop = (e: Event) => {
      const { goodsId, imageUrl } = (
        e as CustomEvent<{ goodsId: number; imageUrl: string }>
      ).detail;
      if (typeof goodsId === 'number' && typeof imageUrl === 'string') {
        setItemImage(item.id, goodsId, imageUrl);
      }
      clearThisSlot();
    };
    const onTouchEnd = () => clearThisSlot();

    el.addEventListener('goods-touch-dragover', onTouchDragOver);
    el.addEventListener('goods-touch-drop', onTouchDrop);
    touchEndHandlers.add(onTouchEnd);
    ensureDocumentTouchEnd();
    return () => {
      el.removeEventListener('goods-touch-dragover', onTouchDragOver);
      el.removeEventListener('goods-touch-drop', onTouchDrop);
      touchEndHandlers.delete(onTouchEnd);
      cleanupDocumentTouchEndIfEmpty();
      if (touchDragHoverClearMap.get(item.id) === clearThisSlot) {
        touchDragHoverClearMap.delete(item.id);
      }
      if (currentTouchDragoverItemId === item.id)
        currentTouchDragoverItemId = null;
    };
  }, [item.id, item.imageSrc, setItemImage]);

  if (item.imageSrc) {
    return (
      <div
        ref={itemRef}
        style={getItemGridCoord(item)}
        className={clsx(
          'relative z-20 mx-2 overflow-hidden rounded-lg',
          !isEditMode &&
            'cursor-pointer transition-[filter] hover:brightness-110'
        )}
        onMouseEnter={() => isEditMode && setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          if (!isEditMode && itemRef.current) {
            onItemClick(item, itemRef.current.getBoundingClientRect());
          }
        }}
      >
        <img
          src={item.imageSrc}
          alt={item.goodsName ?? 'shelf item'}
          className='pointer-events-none h-full w-full object-contain'
          draggable={false}
        />
        {isEditMode && isHovered && (
          <button
            onClick={e => {
              e.stopPropagation();
              removeItem(item.id);
            }}
            className='bg-point-pink text-purple-white hover:bg-point-pink/80 pointer-events-auto absolute top-1 right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full text-xs shadow transition-colors'
          >
            ✕
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      ref={slotRef}
      style={getItemGridCoord(item)}
      className={clsx(
        'z-20 mx-2 flex items-center justify-center rounded-lg border-2 border-dashed transition-colors',
        isDragOver
          ? 'border-point-green bg-point-green/20'
          : 'border-secondary/50 bg-secondary/10'
      )}
      onDragOver={e => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={() => setIsDragOver(false)}
      onDrop={e => {
        e.preventDefault();
        const raw = e.dataTransfer.getData('inventory-goods');
        if (raw) {
          try {
            const { goodsId, imageUrl } = JSON.parse(raw);
            if (typeof goodsId === 'number' && typeof imageUrl === 'string') {
              setItemImage(item.id, goodsId, imageUrl);
            }
          } catch {
            // 앱 외부에서 드롭된 잘못된 데이터 무시
          }
        }
        setIsDragOver(false);
      }}
    />
  );
};

const ShelfItems = ({ items, setItemImage, removeItem }: ShelfItemsProps) => {
  const isEditMode = useSelector((state: RootState) => state.shelf.isEditMode);
  const [detailItem, setDetailItem] = useState<Item | null>(null);
  const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

  const handleItemClick = (item: Item, rect: DOMRect) => {
    setDetailItem(item);
    setAnchorRect(rect);
  };

  const handleClose = () => {
    setDetailItem(null);
    setAnchorRect(null);
  };

  return (
    <>
      {items.map(item => (
        <ShelfItem
          key={item.id}
          item={item}
          setItemImage={setItemImage}
          removeItem={removeItem}
          isEditMode={isEditMode}
          onItemClick={handleItemClick}
        />
      ))}

      {createPortal(
        <GoodsDetailOverlay
          item={detailItem}
          anchorRect={anchorRect}
          onClose={handleClose}
        />,
        document.body
      )}
    </>
  );
};

export default ShelfItems;
