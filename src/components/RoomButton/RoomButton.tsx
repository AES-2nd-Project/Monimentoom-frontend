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
        `flex items-center justify-center rounded-lg`,
        color === `button` && `bg-button`,
        color === `point-pink` && `bg-point-pink`,
        color === `point-green` && `bg-point-green`
      )}
    >
      <span>{label}</span>
    </button>
  );
};

export default RoomButton;
