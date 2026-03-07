import clsx from 'clsx';

interface RoomButtonProps {
  onClick: () => void;
  color: 'button' | 'point-pink' | 'point-green';
  label: string;
}

const RoomButton = ({ onClick, color, label }: RoomButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={clsx(
        `text-purple-white flex h-15 w-15 items-center justify-center rounded-lg p-4 transition-all hover:opacity-80 active:brightness-90`,
        color === `button` && `bg-button`,
        color === `point-pink` && `bg-point-pink`,
        color === `point-green` && `bg-point-green`
      )}
    >
      <span className={``}>{label}</span>
    </button>
  );
};

export default RoomButton;
