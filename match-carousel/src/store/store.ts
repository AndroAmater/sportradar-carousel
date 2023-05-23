
// store.ts
import { configureStore, Action } from '@reduxjs/toolkit';
import matches from './matches';
import { ThunkAction } from 'redux-thunk';

export const store = configureStore({
  reducer: {
    matches
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<ReturnType, RootState, unknown, Action<string>>;
