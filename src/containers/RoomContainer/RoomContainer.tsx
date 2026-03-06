import logo from '../../assets/logo.png';
import Shelf from '../../components/Shelf/Shelf';
import type { Direction } from '../../types/room';

const RoomContainer = () => {
  //isHome 받아서 dim 효과, logo 표시 여부 설정
  const dir1: Direction = 'Left';
  const dir2: Direction = 'Left';
  return (
    <div
      className={`flex h-full w-full items-center justify-center bg-[linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('/src/assets/image.jpg')]`}
    >
      <img
        src={logo}
        className={`absolute w-100 items-center justify-center object-contain`}
      />
      <Shelf direction={dir1} />
      <Shelf direction={dir2} />
    </div>
  );
};

export default RoomContainer;
