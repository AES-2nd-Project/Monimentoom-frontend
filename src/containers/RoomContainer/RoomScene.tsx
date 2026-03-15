import clsx from 'clsx';
import { motion } from 'framer-motion';
import Shelf from '../../components/Shelf/Shelf';
import RoomEasel from './RoomEasel';
import RoomFrame from './RoomFrame';

interface RoomSceneProps {
  isHome: boolean;
  onStart?: () => void;
}

const RoomScene = ({ isHome, onStart }: RoomSceneProps) => {
  return (
    <div
      className={clsx(
        `relative z-0 flex h-250 w-full min-w-7xl shrink-0 items-center justify-center overflow-hidden`
      )}
    >
      {/* 홈 화면 랜딩 오버레이 */}
      {isHome && (
        <div
          className={clsx(
            'z-100 flex h-full w-full flex-col items-center justify-center gap-8',
            'bg-purple-black/50',
            'backdrop-blur-[6px]'
          )}
        >
          <div className="pointer-events-none aspect-1280/698 w-200 bg-[url('/src/assets/logo.png')] bg-cover bg-center bg-no-repeat opacity-80" />

          {/* 시작하기 버튼 */}
          <button
            type='button'
            onClick={onStart}
            className='bg-point-green cursor-pointer rounded-full px-10 py-3 text-lg font-semibold text-white transition-[filter] hover:brightness-110 active:brightness-90'
          >
            시작하기
          </button>

          {/* 아래 화살표 애니메이션 */}
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className='text-purple-white/70 cursor-pointer'
            onClick={onStart}
          >
            <svg
              width='32'
              height='32'
              viewBox='0 0 24 24'
              fill='none'
              stroke='currentColor'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <polyline points='6 9 12 15 18 9' />
            </svg>
          </motion.div>
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
      <RoomFrame />

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
      <RoomEasel />

      {/* 선반 */}
      <main className='absolute bottom-40 z-20 flex w-full max-w-7xl origin-bottom justify-between px-20'>
        <Shelf isLeft={true} />
        <Shelf isLeft={false} />
      </main>
    </div>
  );
};

export default RoomScene;
