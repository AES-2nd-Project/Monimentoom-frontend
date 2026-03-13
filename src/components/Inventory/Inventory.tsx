import clsx from 'clsx';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store';
import InventoryCard from './InventoryCard';

const CARDS_KEY = 'inventory_cards';
const REMOVE_DURATION = 300; // ms, CSS transition과 맞춤

interface CardData {
  id: string;
  imageSrc: string;
}

const loadCards = (): CardData[] => {
  try {
    const raw = localStorage.getItem(CARDS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveCards = (cards: CardData[]) => {
  localStorage.setItem(CARDS_KEY, JSON.stringify(cards));
};

const Inventory = () => {
  const isEditMode = useSelector((state: RootState) => state.shelf.isEditMode);
  const [cards, setCards] = useState<CardData[]>(loadCards);
  const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());

  const addCard = (imageSrc: string) => {
    const newCard: CardData = { id: `card_${Date.now()}`, imageSrc };
    const next = [...cards, newCard];
    setCards(next);
    saveCards(next);
  };

  const removeCard = (id: string) => {
    // 1단계: 애니메이션 시작
    setRemovingIds(prev => new Set(prev).add(id));
    // 2단계: 애니메이션 끝난 뒤 실제 제거
    setTimeout(() => {
      setCards(prev => {
        const next = prev.filter(c => c.id !== id);
        saveCards(next);
        return next;
      });
      setRemovingIds(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }, REMOVE_DURATION);
  };

  return (
    <div
      className={clsx(
        `flex w-full flex-row flex-nowrap gap-4 overflow-x-auto transition-all duration-700 [ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden`,
        isEditMode
          ? 'mt-6 h-60 opacity-100'
          : 'pointer-events-none h-0 opacity-0'
      )}
    >
      {cards.map(card => {
        const isRemoving = removingIds.has(card.id);
        return (
          // wrapper가 width를 0으로 줄이며 공간까지 함께 사라짐
          <div
            key={card.id}
            className='shrink-0 overflow-hidden transition-[width,opacity] ease-in-out'
            style={{
              width: isRemoving ? 0 : '15rem', // w-60 = 15rem
              opacity: isRemoving ? 0 : 1,
              transitionDuration: `${REMOVE_DURATION}ms`,
            }}
          >
            <InventoryCard
              imageSrc={card.imageSrc}
              onRemove={() => removeCard(card.id)}
            />
          </div>
        );
      })}

      {/* 항상 끝에 있는 빈 카드 */}
      <InventoryCard onAdd={addCard} />
    </div>
  );
};

export default Inventory;
