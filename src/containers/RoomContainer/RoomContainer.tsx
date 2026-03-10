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
        `relative z-0 flex h-250 w-full min-w-7xl shrink-0 items-center justify-center`
      )}
    >
      {/* 홈 화면 효과 */}
      {isHome && (
        <div
          className={clsx(
            'pointer-events-none z-100 flex h-full w-full items-center justify-center',
            'bg-purple-black/50',
            'backdrop-blur-[6px]'
          )}
        >
          {/* 중앙에 로고 배치 */}
          <div className="aspect-1280/698 w-200 bg-[url('/src/assets/logo.png')] bg-cover bg-center bg-no-repeat opacity-80"></div>
        </div>
      )}

      {/* 바닥 */}
      <div
        className={`absolute top-1/2 z-0 h-1/2 w-7xl bg-[url('/src/assets/floor.jpg')] bg-size-[101%_cover] bg-position-[calc(50%-6px)] bg-no-repeat`}
      ></div>

      {/* 벽 */}
      <div
        className={`absolute top-[-25%] right-1/2 z-10 h-[90%] w-160 shrink-0 origin-right transform-[skewY(-13.8deg)] border-r-2 border-b-6 bg-[url('/src/assets/wall.jpg')] bg-cover bg-center bg-no-repeat`}
      ></div>

      {/* 벽 */}
      <div
        className={`absolute top-[-25%] left-1/2 z-10 h-[90%] w-160 origin-left transform-[skewY(13.8deg)] border-b-6 border-l-2 bg-[url('/src/assets/wall.jpg')] bg-cover bg-center bg-no-repeat`}
      ></div>

      {/* 액자 */}
      <div
        className={`absolute right-[calc(53%)] bottom-[calc(68%)] z-20 aspect-1766/1703 w-70 origin-right transform-[skewY(-13.8deg)]`}
      >
        <div
          className={`absolute inset-0 z-20 bg-[url('/src/assets/frame.png')] bg-cover bg-no-repeat`}
        ></div>
        <div
          className={`bg-purple-white absolute top-23 left-5 z-10 flex h-[59%] w-[87%] origin-right items-center justify-center bg-[url('/src/assets/Kaede.png')] bg-contain bg-center bg-no-repeat`}
        ></div>
      </div>

      {/* 선반 */}
      <main className='absolute bottom-40 z-20 flex w-full max-w-7xl origin-bottom justify-between px-20'>
        <Shelf isLeft={true} />
        <Shelf isLeft={false} />
      </main>
    </div>
  );
};

export default RoomContainer;
