import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface ShelfState {
  isEditMode: boolean;
}

const initialState: ShelfState = {
  isEditMode: false,
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
  },
});

export const { setIsEditMode, toggleIsEditMode } = shelfSlice.actions;
export default shelfSlice.reducer;
