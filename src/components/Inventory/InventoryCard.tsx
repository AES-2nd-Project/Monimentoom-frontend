import { useRef, useState } from 'react';

interface FilledCardProps {
  imageSrc: string;
  onRemove: () => void;
  onAdd?: never;
}

interface EmptyCardProps {
  onAdd: (imageSrc: string) => void;
  imageSrc?: never;
  onRemove?: never;
}

type InventoryCardProps = FilledCardProps | EmptyCardProps;

const InventoryCard = ({ imageSrc, onRemove, onAdd }: InventoryCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      onAdd?.(reader.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  if (!imageSrc) {
    return (
      <div
        className={`border-border/40 hover:border-border text-purple-black/40 hover:text-purple-black/70 bg-card-background flex h-full w-60 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed transition-colors`}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type='file'
          accept='image/*'
          className={`hidden`}
          onChange={handleFileChange}
        />
        <span className={`text-3xl`}>+</span>
      </div>
    );
  }

  return (
    <div
      className={`bg-card-background relative h-full w-60 shrink-0 cursor-grab overflow-hidden rounded-lg active:cursor-grabbing`}
      draggable
      onDragStart={e => {
        e.dataTransfer.setData('inventory-image', imageSrc);
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
