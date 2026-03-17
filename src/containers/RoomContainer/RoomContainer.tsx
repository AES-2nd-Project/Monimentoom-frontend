import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  createPosition,
  deletePosition,
  updatePosition,
} from '../../api/position-api';
import {
  getRandomRoom,
  getRoomMain,
  updateRoomImages,
} from '../../api/room-api';
import type { AppDispatch, RootState } from '../../store';
import {
  setEaselImage,
  setFrameImage,
  setIsEditMode,
  setRoomId as setRoomIdAction,
  setShelfItems,
  updateShelfItemPositionId,
} from '../../store/shelfSlice';
import type { PositionResponse, WallSide } from '../../types/position';
import type { Item } from '../../types/room';
import RoomScene from './RoomScene';

// PositionResponse → Item 변환 (x=r1, y=c1)
const positionToItem = (pos: PositionResponse): Item => ({
  id: pos.id,
  positionId: pos.id,
  goodsId: pos.goodsId,
  imageSrc: pos.imageUrl,
  goodsName: pos.goodsName,
  goodsDescription: pos.goodsDescription,
  r1: pos.x,
  r2: pos.x + pos.heightUnit - 1,
  c1: pos.y,
  c2: pos.y + pos.widthUnit - 1,
});

interface RoomContainerProps {
  onStart?: () => void;
}

const RoomContainer = ({ onStart }: RoomContainerProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const navigate = useNavigate();
  const { nickname: urlNickname } = useParams<{ nickname: string }>();
  const isHome = location.pathname === '/';
  const authNickname = useSelector((state: RootState) => state.auth.nickname);
  const isLoggedIn = useSelector((state: RootState) => state.auth.isLoggedIn);
  // URL 파라미터 닉네임 우선, 없으면 로그인된 닉네임 사용
  const nickname = urlNickname ?? authNickname;
  const isEditMode = useSelector((state: RootState) => state.shelf.isEditMode);
  const leftItems = useSelector((state: RootState) => state.shelf.leftItems);
  const rightItems = useSelector((state: RootState) => state.shelf.rightItems);
  const frameImageUrl = useSelector(
    (state: RootState) => state.shelf.frameImageUrl
  );
  const easelImageUrl = useSelector(
    (state: RootState) => state.shelf.easelImageUrl
  );

  const roomId = useSelector((state: RootState) => state.shelf.roomId);
  // 지정이동에서 미리 로드한 데이터 — 재요청 없이 한 번만 소비
  const preloadedDataRef = useRef<
    import('../../types/position').RoomPositionResponse | null
  >(
    (
      location.state as {
        roomData?: import('../../types/position').RoomPositionResponse;
      } | null
    )?.roomData ?? null
  );
  const serverPositionsRef = useRef<PositionResponse[]>([]);
  // 서버 기준 frameImageUrl/easelImageUrl — 변경 여부 비교용
  const serverFrameImageUrlRef = useRef<string | null>(null);
  const serverEaselImageUrlRef = useRef<string | null>(null);

  // isEditMode 감지 effect에서 최신값을 읽기 위한 ref
  const leftItemsRef = useRef<Item[]>(leftItems);
  const rightItemsRef = useRef<Item[]>(rightItems);
  const frameImageUrlRef = useRef<string | null>(frameImageUrl);
  const easelImageUrlRef = useRef<string | null>(easelImageUrl);
  const isEditModeRef = useRef(isEditMode);
  const roomIdRef = useRef(roomId);
  useEffect(() => {
    leftItemsRef.current = leftItems;
    rightItemsRef.current = rightItems;
    frameImageUrlRef.current = frameImageUrl;
    easelImageUrlRef.current = easelImageUrl;
    isEditModeRef.current = isEditMode;
    roomIdRef.current = roomId;
  }, [leftItems, rightItems, frameImageUrl, easelImageUrl, isEditMode, roomId]);

  const loadRoomData = useCallback(
    (
      fetcher: () => Promise<
        import('../../types/position').RoomPositionResponse
      >
    ) => {
      fetcher()
        .then(roomData => {
          dispatch(setRoomIdAction(roomData.roomId));
          serverPositionsRef.current = roomData.positions;

          const initialFrameImageUrl = roomData.frameImageUrl ?? null;
          serverFrameImageUrlRef.current = initialFrameImageUrl;
          dispatch(setFrameImage(initialFrameImageUrl));

          const initialEaselImageUrl = roomData.easelImageUrl ?? null;
          serverEaselImageUrlRef.current = initialEaselImageUrl;
          dispatch(setEaselImage(initialEaselImageUrl));

          dispatch(
            setShelfItems({
              wallSide: 'LEFT',
              items: roomData.positions
                .filter(p => p.wallSide === 'LEFT')
                .map(p => positionToItem(p)),
            })
          );
          dispatch(
            setShelfItems({
              wallSide: 'RIGHT',
              items: roomData.positions
                .filter(p => p.wallSide === 'RIGHT')
                .map(p => positionToItem(p)),
            })
          );
        })
        .catch((error: unknown) => {
          const status = (error as { response?: { status?: number } })?.response
            ?.status;
          if (!isHome && status === 404) {
            navigate('/', { replace: true });
          } else {
            console.error(error);
          }
        });
    },
    [dispatch, isHome, navigate]
  );

  // 홈 페이지: 랜덤 방을 4초마다 순환
  useEffect(() => {
    if (!isHome) return;
    loadRoomData(getRandomRoom);
    const intervalId = setInterval(() => loadRoomData(getRandomRoom), 4000);
    return () => clearInterval(intervalId);
  }, [isHome, loadRoomData]);

  // 룸 페이지 진입 시 서버 데이터로 Redux items 초기화
  // URL 닉네임이 있으면 비로그인 게스트도 조회 가능 (타인 방 방문)
  // 지정이동으로 진입한 경우 preloaded 데이터를 재사용해 중복 요청 방지
  useEffect(() => {
    if (isHome || !nickname) return;
    if (preloadedDataRef.current) {
      const data = preloadedDataRef.current;
      preloadedDataRef.current = null;
      // navigation state 소비 후 history에서 제거 (뒤로가기/새로고침 시 재요청)
      navigate(location.pathname, { replace: true, state: null });
      loadRoomData(() => Promise.resolve(data));
    } else {
      loadRoomData(() => getRoomMain(nickname));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHome, isLoggedIn, nickname, loadRoomData]);

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

  // syncPositions 최신 참조 유지 (unmount 클린업에서 사용)
  const syncPositionsRef = useRef(syncPositions);
  useEffect(() => {
    syncPositionsRef.current = syncPositions;
  }, [syncPositions]);

  // 언마운트(다른 페이지/방으로 이동) 시 편집모드 강제 저장 종료
  useEffect(() => {
    return () => {
      if (!isEditModeRef.current) return;
      syncPositionsRef.current('LEFT', leftItemsRef.current);
      syncPositionsRef.current('RIGHT', rightItemsRef.current);
      const currentRoomId = roomIdRef.current;
      if (
        currentRoomId &&
        (frameImageUrlRef.current !== serverFrameImageUrlRef.current ||
          easelImageUrlRef.current !== serverEaselImageUrlRef.current)
      ) {
        updateRoomImages(
          currentRoomId,
          frameImageUrlRef.current,
          easelImageUrlRef.current
        ).catch(console.error);
      }
      dispatch(setIsEditMode(false));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 편집 모드 true → false 전환 감지 (편집 모드 종료 시점)
  const prevEditMode = useRef(isEditMode);
  useEffect(() => {
    if (prevEditMode.current && !isEditMode) {
      syncPositions('LEFT', leftItemsRef.current);
      syncPositions('RIGHT', rightItemsRef.current);

      // 액자/이젤 이미지 변경 시 서버 반영 (둘 중 하나라도 바뀌면 같이 전송)
      if (
        roomId &&
        (frameImageUrlRef.current !== serverFrameImageUrlRef.current ||
          easelImageUrlRef.current !== serverEaselImageUrlRef.current)
      ) {
        updateRoomImages(
          roomId,
          frameImageUrlRef.current,
          easelImageUrlRef.current
        )
          .then(() => {
            serverFrameImageUrlRef.current = frameImageUrlRef.current;
            serverEaselImageUrlRef.current = easelImageUrlRef.current;
          })
          .catch(console.error);
      }
    }
    prevEditMode.current = isEditMode;
  }, [isEditMode, syncPositions, roomId]);

  return <RoomScene isHome={isHome} onStart={onStart} />;
};

export default RoomContainer;
