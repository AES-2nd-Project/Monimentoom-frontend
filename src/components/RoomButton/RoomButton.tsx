import clsx from 'clsx';

interface RoomButtonProps {
  onClick: () => void;
  color: 'button' | 'point-pink' | 'point-green' | 'gray';
  label: string;
  visibility: boolean;
}

const RoomButton = ({ onClick, color, label, visibility }: RoomButtonProps) => {
  return (
    <button
      type='button'
      onClick={onClick}
      className={clsx(
        'shrink-0 whitespace-nowrap cursor-pointer rounded-full px-4 py-2 text-sm font-medium transition-all active:scale-95',
        !visibility && 'invisible',
        color === 'button' &&
          'bg-button text-purple-white hover:brightness-110',
        color === 'point-pink' &&
          'bg-point-pink text-purple-white hover:brightness-110',
        color === 'point-green' &&
          'bg-point-green text-purple-white hover:brightness-110',
        color === 'gray' &&
          'border-purple-black/70 text-purple-black/70 border bg-transparent hover:opacity-80'
      )}
    >
      {label}
    </button>
  );
};

export default RoomButton;
