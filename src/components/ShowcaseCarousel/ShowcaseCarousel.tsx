import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getShowcaseItems } from '../../api/room-api';
import type { ShowcaseItem } from '../../types/room';

const ITEM_WIDTH = 140; // px (w-35 = 8.75rem = 140px)
const GAP = 16; // px (gap-4 = 1rem = 16px)
const SPEED = 40; // px per second

const ShowcaseCarousel = () => {
  const [items, setItems] = useState<ShowcaseItem[]>([]);
  const [loading, setLoading] = useState(true);
  // paused를 ref로 관리 — 변경 시 animation effect 재실행 없이 즉시 반영
  const pausedRef = useRef(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const offsetRef = useRef(0);
  const rafRef = useRef<number>(0);
  const navigate = useNavigate();

  useEffect(() => {
    getShowcaseItems(20)
      .then(setItems)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // 무한 스크롤 애니메이션 — items가 바뀔 때만 재실행
  useEffect(() => {
    if (items.length === 0) return;

    const totalWidth = items.length * (ITEM_WIDTH + GAP);
    let lastTime = 0;

    const animate = (time: number) => {
      if (lastTime === 0) lastTime = time;
      const delta = (time - lastTime) / 1000;
      lastTime = time;

      if (!pausedRef.current) {
        offsetRef.current = (offsetRef.current + SPEED * delta) % totalWidth;
      }

      if (trackRef.current) {
        trackRef.current.style.transform = `translateX(-${offsetRef.current}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [items]);

  if (loading) {
    // 로딩 중 스켈레톤 — 레이아웃 자리 확보
    return (
      <div className='flex flex-1 gap-4 overflow-hidden'>
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className='bg-card-background h-42 w-35 shrink-0 animate-pulse rounded-lg'
          />
        ))}
      </div>
    );
  }

  if (items.length === 0) return null;

  // 아이템을 복제해 이음새 없는 루프 보장
  const displayItems = [...items, ...items];

  return (
    <div
      className='relative flex-1 overflow-hidden'
      onMouseEnter={() => {
        pausedRef.current = true;
      }}
      onMouseLeave={() => {
        pausedRef.current = false;
      }}
    >
      {/* 좌우 페이드 그라디언트 */}
      <div className='pointer-events-none absolute inset-y-0 left-0 z-10 w-12 bg-linear-to-r from-white to-transparent' />
      <div className='pointer-events-none absolute inset-y-0 right-0 z-10 w-12 bg-linear-to-l from-white to-transparent' />

      <div
        ref={trackRef}
        className='flex w-max gap-4'
        style={{ willChange: 'transform' }}
      >
        {displayItems.map((item, i) => (
          <button
            key={`${item.ownerNickname}-${item.goodsName}-${i}`}
            onClick={() => navigate(`/rooms/${item.ownerNickname}`)}
            className='group flex w-35 shrink-0 cursor-pointer flex-col items-center gap-2 rounded-lg border-none bg-transparent p-2 transition-transform hover:scale-105'
          >
            <div className='bg-card-background flex h-30 w-30 items-center justify-center overflow-hidden rounded-lg'>
              <img
                src={item.imageUrl}
                alt={item.goodsName}
                className='h-full w-full object-contain'
                loading='lazy'
                onError={e => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = '/icon.png';
                }}
              />
            </div>
            <p className='text-purple-black w-full truncate text-center text-xs font-medium'>
              {item.goodsName}
            </p>
            <p className='text-purple-black/50 w-full truncate text-center text-[10px]'>
              @{item.ownerNickname}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ShowcaseCarousel;
