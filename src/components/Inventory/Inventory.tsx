import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  createGoods,
  deleteGoods,
  getGoods,
  type GoodsResponse,
} from '../../api/goods-api';
import { getGoodsPresignedUrl, uploadToS3 } from '../../api/s3-api';
import type { RootState } from '../../store';
import InventoryCard from './InventoryCard';

const REMOVE_DURATION = 300;

const Inventory = () => {
  const isEditMode = useSelector((state: RootState) => state.shelf.isEditMode);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const [cards, setCards] = useState<GoodsResponse[]>([]);
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());
  const [isUploading, setIsUploading] = useState(false);
  const timeoutIdsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  // 로그인 상태일 때 goods 목록 불러오기
  useEffect(() => {
    if (!isLoggedIn) return;
    getGoods().then(setCards).catch(console.error);
  }, [isLoggedIn]);

  // 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
      timeoutIdsRef.current.clear();
    };
  }, []);

  const addCard = async (file: File) => {
    setIsUploading(true);
    try {
      // Presigned URL 발급
      const { presignedUrl, imageUrl, contentType } =
        await getGoodsPresignedUrl(file.name);
      // S3에 업로드
      await uploadToS3(presignedUrl, file, contentType);
      // goods 등록 (이름은 확장자 제거)
      const name = file.name.replace(/\.[^/.]+$/, '');
      const newGoods = await createGoods({ name, imageUrl });
      setCards(prev => [...prev, newGoods]);
    } catch (err) {
      console.error('goods 등록 실패:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const removeCard = (id: number) => {
    const isPlaced = (cards.find(c => c.id === id)?.positions.length ?? 0) > 0;
    if (isPlaced) {
      const confirmed = confirm(
        '해당 굿즈는 방에 배치되어 있습니다.\n삭제 시 배치된 굿즈가 모두 해제됩니다.\n정말 삭제하시겠습니까?'
      );
      if (!confirmed) return;
    }
    setRemovingIds(prev => new Set(prev).add(id));
    const timeoutId = setTimeout(async () => {
      try {
        await deleteGoods(id);
        setCards(prev => prev.filter(c => c.id !== id));
      } catch (err) {
        console.error('goods 삭제 실패:', err);
      } finally {
        setRemovingIds(prev => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
        timeoutIdsRef.current.delete(id);
      }
    }, REMOVE_DURATION);
    timeoutIdsRef.current.set(id, timeoutId);
  };

  return (
    <div
      className={clsx(
        `flex w-full flex-row flex-nowrap gap-4 overflow-x-auto transition-all duration-700 [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`,
        isEditMode
          ? `mt-6 h-60 opacity-100`
          : `pointer-events-none h-0 opacity-0`
      )}
    >
      {cards.map(card => {
        const isRemoving = removingIds.has(card.id);
        return (
          <div
            key={card.id}
            className={`shrink-0 overflow-hidden transition-[width,opacity] ease-in-out`}
            style={{
              width: isRemoving ? 0 : '15rem',
              opacity: isRemoving ? 0 : 1,
              transitionDuration: `${REMOVE_DURATION}ms`,
            }}
          >
            <InventoryCard
              goodsId={card.id}
              imageSrc={card.imageUrl}
              onRemove={() => removeCard(card.id)}
            />
          </div>
        );
      })}

      {/* 끝에 있는 빈 카드 — 업로드 중이면 로딩 표시 */}
      <InventoryCard onAdd={addCard} isUploading={isUploading} />
    </div>
  );
};

export default Inventory;
