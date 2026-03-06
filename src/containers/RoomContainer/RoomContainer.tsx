import clsx from 'clsx';
import logo from '../../assets/logo.png';
import Shelf from '../../components/Shelf/Shelf';
import type { Direction } from '../../types/room';

interface RoomContainerProps {
  isHome: Boolean;
}

const RoomContainer = ({ isHome }: RoomContainerProps) => {
  const dir1: Direction = 'Left';
  const dir2: Direction = 'Left';

  // Home일 시 약간의 dim 효과
  const bgDim = isHome
    ? "bg-[linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('/src/assets/image.jpg')]"
    : "bg-[url('/src/assets/image.jpg')]";

  return (
    <div
      className={clsx(
        `relative flex h-full w-full items-center justify-center`,
        bgDim,
        `url('/src/assets/image.jpg')]`
      )}
    >
      {/* Home이 아닐 시 로고 미표시 */}
      {isHome && (
        <img
          src={logo}
          className={`absolute w-100 items-center justify-center object-contain`}
        />
      )}
      <Shelf direction={dir1} />
      <Shelf direction={dir2} />
    </div>
  );
};

export default RoomContainer;
