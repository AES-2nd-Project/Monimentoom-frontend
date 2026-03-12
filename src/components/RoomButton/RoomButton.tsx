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
        `text-purple-white flex h-15 w-15 items-center justify-center rounded-lg p-4 transition-all hover:opacity-80 active:brightness-90`,
        !visibility && `invisible`,
        color === `button` && `bg-button`,
        color === `point-pink` && `bg-point-pink`,
        color === `point-green` && `bg-point-green`,
        color === `gray` && `bg-gray-400`
      )}
    >
      <span>{label}</span>
    </button>
  );
};

export default RoomButton;
