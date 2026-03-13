import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { WallSide } from '../types/position';
import type { Item } from '../types/room';

interface ShelfState {
  isEditMode: boolean;
  leftItems: Item[];
  rightItems: Item[];
}

const initialState: ShelfState = {
  isEditMode: false,
  leftItems: [],
  rightItems: [],
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
    // createPosition 성공 후 positionId 반영 — 중복 POST 방지의 핵심
    updateShelfItemPositionId: (
      state,
      action: PayloadAction<{
        wallSide: WallSide;
        localId: number;
        positionId: number;
      }>
    ) => {
      const list =
        action.payload.wallSide === 'LEFT' ? state.leftItems : state.rightItems;
      const item = list.find(i => i.id === action.payload.localId);
      if (item) {
        item.positionId = action.payload.positionId;
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
  updateShelfItemImage,
  updateShelfItemPositionId,
} = shelfSlice.actions;

export default shelfSlice.reducer;
