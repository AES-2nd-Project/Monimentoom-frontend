import { configureStore } from '@reduxjs/toolkit';
import shelfReducer from './shelfSlice';

export const store = configureStore({
  reducer: {
    shelf: shelfReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
