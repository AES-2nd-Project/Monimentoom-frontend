import { AnimatePresence, motion } from 'framer-motion';
import { useRef } from 'react';
import type { Item } from '../../types/room';

interface GoodsDetailOverlayProps {
  item: Item | null;
  anchorRect: DOMRect | null;
  onClose: () => void;
}

const GoodsDetailOverlay = ({
  item,
  anchorRect,
  onClose,
}: GoodsDetailOverlayProps) => {
  // exit 애니메이션 중에도 마지막 값 유지
  const lastRectRef = useRef<DOMRect | null>(null);
  if (anchorRect) lastRectRef.current = anchorRect;
  const rect = lastRectRef.current;

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;
  const originX = rect ? rect.left + rect.width / 2 : centerX;
  const originY = rect ? rect.top + rect.height / 2 : centerY;

  const expandedSize = Math.max(
    Math.min(window.innerWidth, window.innerHeight) * 0.4,
    280
  );

  return (
    <AnimatePresence>
      {item && rect && (
        <>
          {/* 배경 딤 */}
          <motion.div
            className='fixed inset-0 z-999 bg-black/60'
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
          />

          {/* 확대 카드 */}
          <motion.div
            className='fixed z-1000 flex flex-col items-center gap-3'
            style={{ left: originX, top: originY }}
            initial={{ x: '-50%', y: '-50%', scale: 0.4, opacity: 0 }}
            animate={{
              left: centerX,
              top: centerY - 30,
              x: '-50%',
              y: '-50%',
              scale: 1,
              opacity: 1,
            }}
            exit={{
              left: originX,
              top: originY,
              x: '-50%',
              y: '-50%',
              scale: 0.4,
              opacity: 0,
            }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={onClose}
          >
            {/* 굿즈 이미지 */}
            <div
              className='overflow-hidden rounded-xl bg-white/10 shadow-2xl backdrop-blur-sm'
              style={{ width: expandedSize, height: expandedSize }}
            >
              <img
                src={item.imageSrc}
                alt={item.goodsName ?? '굿즈'}
                className='h-full w-full object-contain'
                draggable={false}
              />
            </div>

            {/* 이름 + 설명 */}
            <motion.div
              className='flex max-w-80 flex-col items-center gap-1 text-center'
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.2 }}
            >
              {item.goodsName && (
                <p className='text-lg font-semibold text-white drop-shadow'>
                  {item.goodsName}
                </p>
              )}
              {item.goodsDescription && (
                <p className='text-sm leading-relaxed text-white/80 drop-shadow'>
                  {item.goodsDescription}
                </p>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default GoodsDetailOverlay;
