import clsx from 'clsx';
import logo from '../../assets/Kaede.png';
import Shelf from '../../components/Shelf/Shelf';

interface RoomContainerProps {
  isHome: boolean;
}

const RoomContainer = ({ isHome }: RoomContainerProps) => {
  return (
    <div
      className={clsx(
        `relative z-0 flex h-250 w-full min-w-7xl shrink-0 items-center justify-center`,
        isHome ? `bg-[linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5))]` : ``
      )}
    >
      {/* 바닥 */}
      <div
        className={`absolute top-1/2 z-0 h-1/2 w-7xl bg-[url('/src/assets/floor3.jpg')] bg-size-[101%_cover] bg-position-[calc(50%-6px)] bg-no-repeat`}
      ></div>
      {/* 벽 */}
      <div
        className={`absolute top-[-17.5%] right-1/2 z-10 h-[68%] w-160 shrink-0 origin-right transform-[skewY(-13.8deg)] border-r-2 border-b-6 bg-[url('/src/assets/wall.jpg')] bg-cover bg-center bg-no-repeat`}
      ></div>
      {/* 벽 */}
      <div
        className={`absolute top-[-17.5%] left-1/2 z-10 h-[68%] w-160 origin-left transform-[skewY(13.8deg)] border-b-6 border-l-2 bg-[url('/src/assets/wall.jpg')] bg-cover bg-center bg-no-repeat`}
      ></div>
      {/* 액자 */}
      <div
        className={`absolute right-[calc(62%)] bottom-[calc(75%)] z-20 aspect-1766/1703 w-70 origin-right transform-[skewY(-13.8deg)]`}
      >
        <div
          className={`absolute inset-0 z-20 bg-[url('/src/assets/frame.png')] bg-cover bg-no-repeat`}
        ></div>
        <div
          className={`bg-purple-white absolute top-23 left-5 z-10 flex h-[59%] w-[87%] origin-right items-center justify-center bg-[url('/src/assets/Kaede.png')] bg-contain bg-center bg-no-repeat`}
        >
          <span className=''>+</span>
        </div>
      </div>
      {/* 선반 */}
      <main className='absolute z-20 flex w-full max-w-7xl justify-between px-20'>
        <Shelf isLeft={true} />
        <Shelf isLeft={false} />
      </main>
    </div>
  );
};

export default RoomContainer;
