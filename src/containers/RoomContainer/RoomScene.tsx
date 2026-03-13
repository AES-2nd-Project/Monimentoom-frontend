import clsx from 'clsx';
import Shelf from '../../components/Shelf/Shelf';

interface RoomSceneProps {
  isHome: boolean;
}

const RoomScene = ({ isHome }: RoomSceneProps) => {
  return (
    <div
      className={clsx(
        `relative z-0 flex h-250 w-full min-w-7xl shrink-0 items-center justify-center overflow-hidden`
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
          <div className="aspect-1280/698 w-200 bg-[url('/src/assets/logo.png')] bg-cover bg-center bg-no-repeat opacity-80" />
        </div>
      )}

      {/* 바닥 */}
      <div
        className={`absolute top-1/2 z-0 h-1/2 w-7xl bg-[url('/src/assets/floor.jpg')] bg-size-[101%_cover] bg-position-[calc(50%-6px)] bg-no-repeat`}
      />

      {/* 왼쪽 벽 */}
      <div
        className={`absolute top-[-25%] right-1/2 z-10 h-[90%] w-160 shrink-0 origin-right transform-[skewY(-13.8deg)] border-r-2 border-b-6 bg-[url('/src/assets/wall.jpg')] bg-cover bg-center bg-no-repeat`}
      />

      {/* 오른쪽 벽 */}
      <div
        className={`absolute top-[-25%] left-1/2 z-10 h-[90%] w-160 origin-left transform-[skewY(13.8deg)] border-b-6 border-l-2 bg-[url('/src/assets/wall.jpg')] bg-cover bg-center bg-no-repeat`}
      />

      {/* 액자 */}
      <div
        className={clsx(
          'absolute bottom-[68%] left-1/2 z-20 aspect-1766/1703 w-70',
          'origin-right -translate-x-[calc(100%+20px)] -skew-y-[13.8deg]'
        )}
      >
        <div
          className={`absolute inset-0 z-20 bg-[url('/src/assets/frame.png')] bg-cover bg-no-repeat`}
        />
        <div
          className={`bg-purple-white absolute top-23 left-5 z-10 flex h-[59%] w-[87%] origin-right items-center justify-center bg-[url('/src/assets/Kaede.png')] bg-contain bg-center bg-no-repeat`}
        />
      </div>

      {/* 책장 */}
      <div
        className={clsx(
          'absolute bottom-[58%] left-1/2 z-20 aspect-1600/1868 w-70',
          'origin-right -translate-x-150 -skew-y-[1.8deg]',
          'bg-[url("/src/assets/bookshelf.png")] bg-cover bg-center bg-no-repeat'
        )}
      />

      {/* 창문 */}
      <div
        className={clsx(
          'absolute bottom-[62%] left-1/2 z-20 aspect-1478/1621 w-80',
          'origin-left translate-x-37.5 skew-y-[13.8deg]',
          'bg-[url("/src/assets/window.png")] bg-cover bg-center bg-no-repeat'
        )}
      />

      {/* 이젤 */}
      <div
        className={
          'absolute bottom-[10%] left-1/2 z-20 h-auto w-80 origin-bottom -translate-x-41.25'
        }
      >
        <div
          className={`z-20 aspect-1349/2010 w-full bg-[url('/src/assets/easel.png')] bg-cover bg-center bg-no-repeat`}
        />
        <div
          className={`absolute right-1/2 bottom-45.5 left-4.5 -z-5 h-[41%] w-[89.5%] origin-bottom bg-[url('/src/assets/Kaede.png')] bg-contain bg-center bg-no-repeat`}
        />
      </div>

      {/* 선반 */}
      <main className='absolute bottom-40 z-20 flex w-full max-w-7xl origin-bottom justify-between px-20'>
        <Shelf isLeft={true} />
        <Shelf isLeft={false} />
      </main>
    </div>
  );
};

export default RoomScene;
