import clsx from 'clsx';
import logo from '../../assets/logo.png';
import Shelf from '../../components/Shelf/Shelf';

interface RoomContainerProps {
  isHome: boolean;
}

const RoomContainer = ({ isHome }: RoomContainerProps) => {
  return (
    <div
      className={clsx(
        `relative z-0 flex h-250 w-full min-w-7xl shrink-0 items-center justify-center bg-cover bg-bottom bg-no-repeat`,
        isHome
          ? `bg-[linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('/src/assets/floor.png')]`
          : `bg-[url('/src/assets/floor.png')]`
      )}
    >
      <div
        className={`bg-card-background absolute top-[-24.5%] right-1/2 z-10 h-[75%] w-1/2 shrink-0 origin-right transform-[skewY(-13.8deg)] bg-[url('/src/assets/kaede.png')] bg-contain bg-center bg-no-repeat`}
      ></div>
      <div
        className={`bg-card-background absolute top-[-24.5%] left-1/2 z-10 h-[75%] w-1/2 shrink-0 origin-left transform-[skewY(13.8deg)] bg-[url('/src/assets/kaede.png')] bg-contain bg-center bg-no-repeat`}
      ></div>
      <main className='absolute z-20 flex w-full max-w-7xl justify-between px-20'>
        <Shelf isLeft={true} />
        <Shelf isLeft={false} />
      </main>
    </div>
  );
};

export default RoomContainer;
