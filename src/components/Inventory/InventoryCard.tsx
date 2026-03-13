import clsx from 'clsx';
import { useRef, useState } from 'react';

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

const InventoryCard = ({ goodsId, imageSrc, onRemove, onAdd, isUploading }: InventoryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

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
          <div className={`border-secondary h-8 w-8 animate-spin rounded-full border-4 border-t-transparent`} />
        ) : (
          <span className={`text-purple-black/40 text-3xl`}>+</span>
        )}
      </div>
    );
  }

  // 채워진 카드
  return (
    <div
      className={`bg-card-background relative h-full w-60 shrink-0 cursor-grab overflow-hidden rounded-lg active:cursor-grabbing`}
      draggable
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
