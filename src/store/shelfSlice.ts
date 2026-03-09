import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

export interface RootState {
  shelf: ShelfState;
}

interface ShelfState {
  isShrinked: boolean;
}

const initialState: ShelfState = {
  isShrinked: true,
};

const shelfSlice = createSlice({
  name: 'shelf',
  initialState,
  reducers: {
    setIsShrinked: (state, action: PayloadAction<boolean>) => {
      state.isShrinked = action.payload;
    },
    toggleIsShrinked: state => {
      state.isShrinked = !state.isShrinked;
    },
  },
});

export const { setIsShrinked, toggleIsShrinked } = shelfSlice.actions;
export default shelfSlice.reducer;
