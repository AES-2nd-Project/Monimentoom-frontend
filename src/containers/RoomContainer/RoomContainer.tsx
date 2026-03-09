import clsx from 'clsx';
import logo from '../../assets/logo.png';
import Shelf from '../../components/Shelf/Shelf';

interface RoomContainerProps {
  isHome: boolean;
}

const RoomContainer = ({ isHome }: RoomContainerProps) => {
  // Home일 시 약간의 dim 효과
  const bgDim = isHome
    ? `bg-[linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('/src/assets/image.jpg')]`
    : `bg-[url('/src/assets/image.jpg')]`;

  return (
    <div
      className={clsx(
        `relative flex h-full w-full items-center justify-center`,
        bgDim
      )}
    >
      {/* Home이 아닐 시 로고 미표시 */}
      {isHome && (
        <img
          src={logo}
          className={`absolute z-0 w-100 items-center justify-center object-contain`}
        />
      )}
      {/* 선반 포함한 룸 섹션 */}
      <main className={`z-10 flex max-w-7xl min-w-[70vw] justify-between`}>
        <Shelf />
        <Shelf />
      </main>
    </div>
  );
};

export default RoomContainer;
