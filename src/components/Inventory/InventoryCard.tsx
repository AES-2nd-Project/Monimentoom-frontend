import { useRef, useState } from 'react';

// 채워진 카드
interface FilledCardProps {
  imageSrc: string;
  onRemove: () => void;
  onAdd?: never;
}

// 빈 카드 (끝에 하나)
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

  // 빈 카드
  if (!imageSrc) {
    return (
      <div
        className={`text-purple-black/40 hover:text-purple-black/70 hover:border-purple-black/30 bg-card-background border-purple-black/20 flex h-full w-60 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed transition-colors`}
        onClick={() => inputRef.current?.click()}
      >
        <input
          ref={inputRef}
          type='file'
          accept='image/*'
          className='hidden'
          onChange={handleFileChange}
        />
        <span className='text-3xl'>+</span>
      </div>
    );
  }

  // 채워진 카드
  return (
    <div
      className={`bg-card-background relative h-full w-60 shrink-0 overflow-hidden rounded-lg`}
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
          className={`bg-purple-black/60 text-purple-white hover:bg-purple-black/90 absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full text-xs`}
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default InventoryCard;
