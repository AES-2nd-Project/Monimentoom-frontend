import clsx from 'clsx';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { getGoods } from '../../api/goods-api';
import {
  createPosition,
  deletePosition,
  updatePosition,
} from '../../api/position-api';
import { getRoomMain } from '../../api/room-api';
import Shelf from '../../components/Shelf/Shelf';
import type { AppDispatch, RootState } from '../../store';
import {
  setShelfItems,
  updateShelfItemPositionId,
} from '../../store/shelfSlice';
import type { PositionResponse, WallSide } from '../../types/position';
import type { Item } from '../../types/room';

// PositionResponse → Item 변환 (x=r1, y=c1), goodsId로 imageUrl 매핑
const positionToItem = (
  pos: PositionResponse,
  imageMap: Map<number, string>
): Item => ({
  id: pos.id,
  positionId: pos.id,
  goodsId: pos.goodsId,
  imageSrc: imageMap.get(pos.goodsId),
  r1: pos.x,
  r2: pos.x + pos.heightUnit - 1,
  c1: pos.y,
  c2: pos.y + pos.widthUnit - 1,
});

const RoomContainer = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const isHome = location.pathname === '/';
  const nickname = useSelector((state: RootState) => state.auth.nickname);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  const isEditMode = useSelector((state: RootState) => state.shelf.isEditMode);
  const leftItems = useSelector((state: RootState) => state.shelf.leftItems);
  const rightItems = useSelector((state: RootState) => state.shelf.rightItems);

  const [roomId, setRoomId] = useState<number | null>(null);
  const serverPositionsRef = useRef<PositionResponse[]>([]);

  // isEditMode 감지 effect에서 최신값을 읽기 위한 ref
  const leftItemsRef = useRef<Item[]>(leftItems);
  const rightItemsRef = useRef<Item[]>(rightItems);
  useEffect(() => {
    leftItemsRef.current = leftItems;
    rightItemsRef.current = rightItems;
  }, [leftItems, rightItems]);

  // 룸 진입 시 서버 데이터로 Redux items 초기화
  useEffect(() => {
    if (!isLoggedIn || !nickname) return;
    Promise.all([getRoomMain(nickname), getGoods()])
      .then(([roomData, goods]) => {
        setRoomId(roomData.roomId);
        serverPositionsRef.current = roomData.positions;

        const imageMap = new Map(goods.map(g => [g.id, g.imageUrl]));

        dispatch(
          setShelfItems({
            wallSide: 'LEFT',
            items: roomData.positions
              .filter(p => p.wallSide === 'LEFT')
              .map(p => positionToItem(p, imageMap)),
          })
        );
        dispatch(
          setShelfItems({
            wallSide: 'RIGHT',
            items: roomData.positions
              .filter(p => p.wallSide === 'RIGHT')
              .map(p => positionToItem(p, imageMap)),
          })
        );
      })
      .catch(console.error);
  }, [isLoggedIn, nickname, dispatch]);

  // 편집 모드 종료 시 Redux에서 직접 items를 읽어 sync
  const syncPositions = useCallback(
    async (wallSide: WallSide, items: Item[]) => {
      if (!roomId) return;

      const serverSidePositions = serverPositionsRef.current.filter(
        p => p.wallSide === wallSide
      );
      const serverIds = new Set(serverSidePositions.map(p => p.id));

      const syncableItems = items.filter(item => item.goodsId != null);

      const currentPositionIds = new Set(
        syncableItems
          .filter(item => item.positionId != null)
          .map(item => item.positionId!)
      );

      // DELETE: 서버에 있었지만 현재 없는 것
      const deletePromises = [...serverIds]
        .filter(id => !currentPositionIds.has(id))
        .map(id => deletePosition(id).catch(console.error));

      // PATCH: 위치가 바뀐 것
      const updatePromises = syncableItems
        .filter(
          item => item.positionId != null && serverIds.has(item.positionId)
        )
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
            })
              .then(updated => {
                serverPositionsRef.current = serverPositionsRef.current.map(
                  p => (p.id === updated.id ? updated : p)
                );
              })
              .catch(console.error);
          }
          return Promise.resolve();
        });

      // POST: positionId 없는 새 아이템
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
              serverPositionsRef.current = [
                ...serverPositionsRef.current,
                created,
              ];
              currentPositionIds.add(created.id);
              // Redux items에 positionId 반영 → 다음 sync에서 중복 POST 방지
              dispatch(
                updateShelfItemPositionId({
                  wallSide,
                  localId: item.id,
                  positionId: created.id,
                })
              );
            })
            .catch(console.error)
        );

      await Promise.all([
        ...deletePromises,
        ...updatePromises,
        ...createPromises,
      ]);

      // serverPositionsRef 정리 (삭제된 것 제거)
      serverPositionsRef.current = serverPositionsRef.current.filter(
        p => p.wallSide !== wallSide || currentPositionIds.has(p.id)
      );
    },
    [roomId, dispatch]
  );

  // 편집 모드 true → false 전환 감지 (편집 모드 종료 시점)
  const prevEditMode = useRef(isEditMode);
  useEffect(() => {
    if (prevEditMode.current && !isEditMode) {
      syncPositions('LEFT', leftItemsRef.current);
      syncPositions('RIGHT', rightItemsRef.current);
    }
    prevEditMode.current = isEditMode;
  }, [isEditMode, syncPositions]);

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
