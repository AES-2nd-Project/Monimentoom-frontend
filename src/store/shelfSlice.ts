import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { WallSide } from '../types/position';
import type { Item } from '../types/room';

interface ShelfState {
  isEditMode: boolean;
  leftItems: Item[];
  rightItems: Item[];
  frameImageUrl: string | null;
  easelImageUrl: string | null;
  roomId: number | null;
}

const initialState: ShelfState = {
  isEditMode: false,
  leftItems: [],
  rightItems: [],
  frameImageUrl: null,
  easelImageUrl: null,
  roomId: null,
};

const shelfSlice = createSlice({
  name: 'shelf',
  initialState,
  reducers: {
    setIsEditMode: (state, action: PayloadAction<boolean>) => {
      state.isEditMode = action.payload;
    },
    toggleIsEditMode: state => {
      state.isEditMode = !state.isEditMode;
    },
    // 서버에서 불러온 items로 초기화 (룸 진입 시)
    setShelfItems: (
      state,
      action: PayloadAction<{ wallSide: WallSide; items: Item[] }>
    ) => {
      if (action.payload.wallSide === 'LEFT') {
        state.leftItems = action.payload.items;
      } else {
        state.rightItems = action.payload.items;
      }
    },
    // 인벤토리 드롭으로 아이템 추가
    addShelfItem: (
      state,
      action: PayloadAction<{ wallSide: WallSide; item: Item }>
    ) => {
      if (action.payload.wallSide === 'LEFT') {
        state.leftItems.push(action.payload.item);
      } else {
        state.rightItems.push(action.payload.item);
      }
    },
    // 이미지 없는 아이템에 이미지 드롭 시
    updateShelfItemImage: (
      state,
      action: PayloadAction<{
        wallSide: WallSide;
        id: number;
        goodsId: number;
        imageSrc: string;
      }>
    ) => {
      const list =
        action.payload.wallSide === 'LEFT' ? state.leftItems : state.rightItems;
      const item = list.find(i => i.id === action.payload.id);
      if (item) {
        item.goodsId = action.payload.goodsId;
        item.imageSrc = action.payload.imageSrc;
      }
    },
    // 아이템 제거 (X 버튼 클릭 시)
    removeShelfItem: (
      state,
      action: PayloadAction<{ wallSide: WallSide; id: number }>
    ) => {
      if (action.payload.wallSide === 'LEFT') {
        state.leftItems = state.leftItems.filter(
          i => i.id !== action.payload.id
        );
      } else {
        state.rightItems = state.rightItems.filter(
          i => i.id !== action.payload.id
        );
      }
    },
    // 굿즈 삭제 시 해당 goodsId를 가진 선반 슬롯 전체 제거
    clearShelfItemsByGoodsId: (state, action: PayloadAction<number>) => {
      state.leftItems = state.leftItems.filter(
        i => i.goodsId !== action.payload
      );
      state.rightItems = state.rightItems.filter(
        i => i.goodsId !== action.payload
      );
    },
    // 방 ID 설정
    setRoomId: (state, action: PayloadAction<number | null>) => {
      state.roomId = action.payload;
    },
    // 액자 이미지 설정/해제
    setFrameImage: (state, action: PayloadAction<string | null>) => {
      state.frameImageUrl = action.payload;
    },
    // 이젤 이미지 설정/해제
    setEaselImage: (state, action: PayloadAction<string | null>) => {
      state.easelImageUrl = action.payload;
    },
    // createPosition 성공 후 positionId + 이름/설명 반영
    updateShelfItemPositionId: (
      state,
      action: PayloadAction<{
        wallSide: WallSide;
        localId: number;
        positionId: number;
        goodsName?: string;
        goodsDescription?: string;
      }>
    ) => {
      const list =
        action.payload.wallSide === 'LEFT' ? state.leftItems : state.rightItems;
      const item = list.find(i => i.id === action.payload.localId);
      if (item) {
        item.positionId = action.payload.positionId;
        if (action.payload.goodsName !== undefined)
          item.goodsName = action.payload.goodsName;
        if (action.payload.goodsDescription !== undefined)
          item.goodsDescription = action.payload.goodsDescription;
      }
    },
  },
});

export const {
  setIsEditMode,
  toggleIsEditMode,
  setShelfItems,
  addShelfItem,
  removeShelfItem,
  clearShelfItemsByGoodsId,
  updateShelfItemImage,
  updateShelfItemPositionId,
  setRoomId,
  setFrameImage,
  setEaselImage,
} = shelfSlice.actions;

export default shelfSlice.reducer;
