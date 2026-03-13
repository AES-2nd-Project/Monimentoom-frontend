import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import Shelf from '../../components/Shelf/Shelf';
import type { RootState } from '../../store';
import type { Item } from '../../types/room';
import type { PositionResponse, WallSide } from '../../types/position';
import { getRoomMain } from '../../api/room-api';
import {
  createPosition,
  deletePosition,
  updatePosition,
} from '../../api/position-api';

// PositionResponse → Item 변환 (x=r1, y=c1)
const positionToItem = (pos: PositionResponse): Item => ({
  id: pos.id, // 임시 local id로 positionId 재사용
  positionId: pos.id,
  goodsId: pos.goodsId,
  r1: pos.x,
  r2: pos.x + pos.heightUnit - 1,
  c1: pos.y,
  c2: pos.y + pos.widthUnit - 1,
});

const RoomContainer = () => {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const nickname = useSelector((state: RootState) => state.auth.nickname);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);

  const [roomId, setRoomId] = useState<number | null>(null);
  const [leftItems, setLeftItems] = useState<Item[]>([]);
  const [rightItems, setRightItems] = useState<Item[]>([]);

  // 서버에서 불러온 원본 positions (diff 계산용)
  const serverPositionsRef = useRef<PositionResponse[]>([]);

  useEffect(() => {
    if (!isLoggedIn || !nickname) return;
    getRoomMain(nickname)
      .then(data => {
        setRoomId(data.roomId);
        serverPositionsRef.current = data.positions;

        const left = data.positions
          .filter(p => p.wallSide === 'LEFT')
          .map(positionToItem);
        const right = data.positions
          .filter(p => p.wallSide === 'RIGHT')
          .map(positionToItem);

        setLeftItems(left);
        setRightItems(right);
      })
      .catch(console.error);
  }, [isLoggedIn, nickname]);

  // 편집 모드 종료 시 해당 선반의 positions를 서버와 동기화
  const syncPositions = useCallback(
    async (wallSide: WallSide, items: Item[]) => {
      if (!roomId) return;

      const serverSidePositions = serverPositionsRef.current.filter(
        p => p.wallSide === wallSide
      );
      const serverIds = new Set(serverSidePositions.map(p => p.id));

      // goodsId가 있는 아이템만 동기화 (이미지 등록된 것만)
      const syncableItems = items.filter(item => item.goodsId != null);

      const currentPositionIds = new Set(
        syncableItems
          .filter(item => item.positionId != null)
          .map(item => item.positionId!)
      );

      // 1. 서버에 있었지만 현재 없는 것 → DELETE
      const deletePromises = [...serverIds]
        .filter(id => !currentPositionIds.has(id))
        .map(id => deletePosition(id).catch(console.error));

      // 2. 서버에 있고 현재도 있는 것 → 위치가 바뀌었으면 PATCH
      const updatePromises = syncableItems
        .filter(item => item.positionId != null && serverIds.has(item.positionId))
        .map(item => {
          const original = serverSidePositions.find(
            p => p.id === item.positionId
          );
          if (
            original &&
            (original.x !== item.r1 ||
              original.y !== item.c1 ||
              original.widthUnit !== item.c2 - item.c1 + 1 ||
              original.heightUnit !== item.r2 - item.r1 + 1)
          ) {
            return updatePosition(item.positionId!, {
              goodsId: item.goodsId!,
              roomId,
              wallSide,
              x: item.r1,
              y: item.c1,
              widthUnit: item.c2 - item.c1 + 1,
              heightUnit: item.r2 - item.r1 + 1,
            }).catch(console.error);
          }
          return Promise.resolve();
        });

      // 3. positionId 없는 것 → POST
      const createPromises = syncableItems
        .filter(item => item.positionId == null)
        .map(item =>
          createPosition({
            goodsId: item.goodsId!,
            roomId,
            wallSide,
            x: item.r1,
            y: item.c1,
            widthUnit: item.c2 - item.c1 + 1,
            heightUnit: item.r2 - item.r1 + 1,
          })
            .then(created => {
              // 새로 생성된 position을 serverPositionsRef에 추가
              serverPositionsRef.current = [
                ...serverPositionsRef.current,
                created,
              ];
            })
            .catch(console.error)
        );

      await Promise.all([...deletePromises, ...updatePromises, ...createPromises]);

      // serverPositionsRef 정리 (삭제된 것 제거)
      serverPositionsRef.current = serverPositionsRef.current.filter(
        p => p.wallSide !== wallSide || currentPositionIds.has(p.id)
      );
    },
    [roomId]
  );

  const handleLeftExit = useCallback(
    (items: Item[]) => syncPositions('LEFT', items),
    [syncPositions]
  );

  const handleRightExit = useCallback(
    (items: Item[]) => syncPositions('RIGHT', items),
    [syncPositions]
  );

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
        <Shelf
          key={`left-${roomId ?? 'init'}`}
          isLeft={true}
          initialItems={leftItems}
          onEditModeExit={handleLeftExit}
        />
        <Shelf
          key={`right-${roomId ?? 'init'}`}
          isLeft={false}
          initialItems={rightItems}
          onEditModeExit={handleRightExit}
        />
      </main>
    </div>
  );
};

export default RoomContainer;
