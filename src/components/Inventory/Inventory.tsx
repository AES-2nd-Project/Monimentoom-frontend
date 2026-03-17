import clsx from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { createGoods, deleteGoods, getGoods } from '../../api/goods-api';
import {
  getGoodsPresignedUrl,
  sanitizeFileName,
  uploadToS3,
} from '../../api/s3-api';
import type { RootState } from '../../store';
import type { GoodsResponse } from '../../types/goods';
import GoodsRegisterModal from './GoodsRegisterModal';
import InventoryCard from './InventoryCard';

const REMOVE_DURATION = 300;

const Inventory = () => {
  const isEditMode = useSelector((state: RootState) => state.shelf.isEditMode);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const [cards, setCards] = useState<GoodsResponse[]>([]);
  const [removingIds, setRemovingIds] = useState<Set<number>>(new Set());
  const [isUploading, setIsUploading] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const timeoutIdsRef = useRef<Map<number, ReturnType<typeof setTimeout>>>(
    new Map()
  );

  // 모달 상태: null이면 닫힘, 값이 있으면 열림
  const [pendingGoods, setPendingGoods] = useState<{
    file: File;
    presignedUrl: string;
    imageUrl: string;
    contentType: string;
    previewUrl: string;
    defaultName: string;
  } | null>(null);

  // pendingGoods 교체 or 언마운트 시 이전 previewUrl 정리
  useEffect(() => {
    return () => {
      if (pendingGoods?.previewUrl)
        URL.revokeObjectURL(pendingGoods.previewUrl);
    };
  }, [pendingGoods]);

  useEffect(() => {
    if (!isLoggedIn) return;
    getGoods().then(setCards).catch(console.error);
  }, [isLoggedIn]);

  useEffect(() => {
    return () => {
      timeoutIdsRef.current.forEach(timeoutId => clearTimeout(timeoutId));
      timeoutIdsRef.current.clear();
    };
  }, []);

  // 1단계: 이미지 선택 → presigned URL만 발급 → 모달 오픈 (S3 업로드 아직 안 함)
  const addCard = async (file: File) => {
    setIsUploading(true);
    try {
      const { presignedUrl, imageUrl, contentType } =
        await getGoodsPresignedUrl(sanitizeFileName(file.name));
      const previewUrl = URL.createObjectURL(file);
      const defaultName = file.name.replace(/\.[^/.]+$/, '');
      setPendingGoods({
        file,
        presignedUrl,
        imageUrl,
        contentType,
        previewUrl,
        defaultName,
      });
    } catch (err) {
      console.error('presigned URL 발급 실패:', err);
    } finally {
      setIsUploading(false);
    }
  };

  // 2단계: 확인 → S3 업로드 → createGoods
  const handleModalConfirm = async (name: string, description: string) => {
    if (!pendingGoods || isConfirming) return;
    setIsConfirming(true);
    try {
      await uploadToS3(
        pendingGoods.presignedUrl,
        pendingGoods.file,
        pendingGoods.contentType
      );
      const newGoods = await createGoods({
        name,
        description: description || undefined,
        imageUrl: pendingGoods.imageUrl,
      });
      setCards(prev => [...prev, newGoods]);
      setPendingGoods(null);
    } catch (err) {
      console.error('goods 등록 실패:', err);
    } finally {
      setIsConfirming(false);
    }
  };

  // 모달 취소 — 확인 처리 중에는 닫기 비활성화
  const handleModalCancel = () => {
    if (isConfirming) return;
    setPendingGoods(null);
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
    <>
      <div
        className={clsx(
          `flex w-full flex-row flex-nowrap gap-4 overflow-x-auto transition-all duration-700 [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`,
          isEditMode
            ? `mt-6 h-36 opacity-100 md:h-60`
            : `pointer-events-none h-0 opacity-0`
        )}
      >
        {cards.map(card => {
          const isRemoving = removingIds.has(card.id);
          return (
            <div
              key={card.id}
              className='w-36 shrink-0 overflow-hidden transition-[width,opacity] ease-in-out md:w-60'
              style={{
                width: isRemoving ? 0 : undefined,
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

        <InventoryCard onAdd={addCard} isUploading={isUploading} />
      </div>

      {pendingGoods && (
        <GoodsRegisterModal
          imageUrl={pendingGoods.previewUrl}
          defaultName={pendingGoods.defaultName}
          onConfirm={handleModalConfirm}
          onCancel={handleModalCancel}
          isConfirming={isConfirming}
        />
      )}
    </>
  );
};

export default Inventory;
