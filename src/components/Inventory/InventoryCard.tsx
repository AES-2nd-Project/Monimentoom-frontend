import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';

interface FilledCardProps {
  goodsId: number;
  imageSrc: string;
  onRemove: () => void;
  onAdd?: never;
  isUploading?: never;
}

interface EmptyCardProps {
  onAdd: (file: File) => void;
  isUploading?: boolean;
  goodsId?: never;
  imageSrc?: never;
  onRemove?: never;
}

type InventoryCardProps = FilledCardProps | EmptyCardProps;

const InventoryCard = ({
  goodsId,
  imageSrc,
  onRemove,
  onAdd,
  isUploading,
}: InventoryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // 터치 드래그 중 최신 데이터를 클로저 없이 참조하기 위한 ref
  const dragDataRef = useRef({ goodsId, imageUrl: imageSrc });
  useEffect(() => {
    dragDataRef.current = { goodsId, imageUrl: imageSrc };
  }, [goodsId, imageSrc]);

  // 터치 드래그: 스크롤과 드래그 구분 후 슬롯에 커스텀 이벤트 디스패치
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const touchStartTimeRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    if (!imageSrc) return; // 빈 카드엔 적용 안 함
    const el = cardRef.current;
    if (!el) return;

    const DRAG_DISTANCE_THRESHOLD = 10; // px - 이 거리 이상 움직여야 드래그로 판단
    const DRAG_TIME_THRESHOLD = 150; // ms - 이 시간 이내에 짧게 움직이면 스크롤 허용

    const onTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0];
      touchStartXRef.current = touch.clientX;
      touchStartYRef.current = touch.clientY;
      touchStartTimeRef.current = Date.now();
      isDraggingRef.current = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      // 핀치 줌 등 멀티터치는 간섭하지 않음
      if (e.touches.length > 1) return;

      const touch = e.touches[0];
      const startX = touchStartXRef.current;
      const startY = touchStartYRef.current;
      const startTime = touchStartTimeRef.current;
      if (startX == null || startY == null || startTime == null) return;

      const distance = Math.hypot(
        touch.clientX - startX,
        touch.clientY - startY
      );
      const elapsed = Date.now() - startTime;

      if (!isDraggingRef.current) {
        // 거리/시간 임계치 미달이면 스크롤 허용
        if (distance < DRAG_DISTANCE_THRESHOLD && elapsed < DRAG_TIME_THRESHOLD)
          return;
        isDraggingRef.current = true;
      }

      // 드래그 확정 후 스크롤 차단 + 슬롯 하이라이트 이벤트
      e.preventDefault();
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      target?.dispatchEvent(
        new CustomEvent('goods-touch-dragover', { bubbles: true })
      );
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (!isDraggingRef.current) {
        touchStartXRef.current = null;
        touchStartYRef.current = null;
        touchStartTimeRef.current = null;
        return;
      }
      const touch = e.changedTouches[0];
      const target = document.elementFromPoint(touch.clientX, touch.clientY);
      target?.dispatchEvent(
        new CustomEvent('goods-touch-drop', {
          bubbles: true,
          detail: dragDataRef.current,
        })
      );
      isDraggingRef.current = false;
      touchStartXRef.current = null;
      touchStartYRef.current = null;
      touchStartTimeRef.current = null;
    };

    const onTouchCancel = () => {
      // 터치 강제 취소 시 드래그 상태 초기화 (drop 이벤트 미발생)
      isDraggingRef.current = false;
      touchStartXRef.current = null;
      touchStartYRef.current = null;
      touchStartTimeRef.current = null;
    };

    el.addEventListener('touchstart', onTouchStart);
    el.addEventListener('touchmove', onTouchMove, { passive: false });
    el.addEventListener('touchend', onTouchEnd);
    el.addEventListener('touchcancel', onTouchCancel);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
      el.removeEventListener('touchcancel', onTouchCancel);
    };
  }, [imageSrc]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    onAdd?.(file);
    e.target.value = '';
  };

  // 빈 카드 (끝에 하나)
  if (!imageSrc) {
    return (
      <div
        className={clsx(
          `border-border/40 bg-card-background flex h-full w-60 shrink-0 flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed transition-colors`,
          isUploading
            ? `cursor-wait opacity-60`
            : `hover:border-border cursor-pointer`
        )}
        onClick={() => !isUploading && inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type='file'
          accept='image/*'
          className={`hidden`}
          onChange={handleFileChange}
        />
        {isUploading ? (
          <div
            className={`border-secondary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent`}
          />
        ) : (
          <span className={`text-purple-black/40 text-3xl`}>+</span>
        )}
      </div>
    );
  }

  // 채워진 카드
  return (
    <div
      ref={cardRef}
      className={`bg-card-background relative h-full w-60 shrink-0 cursor-grab overflow-hidden rounded-lg active:cursor-grabbing [-webkit-touch-callout:none] select-none`}
      draggable
      onContextMenu={e => e.preventDefault()}
      onDragStart={e => {
        e.dataTransfer.setData(
          'inventory-goods',
          JSON.stringify({ goodsId, imageUrl: imageSrc })
        );
        e.dataTransfer.effectAllowed = 'copy';
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <img
        src={imageSrc}
        alt='inventory item'
        className={`h-full w-full object-contain`}
        draggable={false}
      />

      {isHovered && (
        <button
          onClick={onRemove}
          className={`bg-purple-black/60 text-purple-white hover:bg-purple-black/90 absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full text-xs transition-colors`}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default InventoryCard;
