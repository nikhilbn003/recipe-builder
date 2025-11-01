import { configureStore } from "@reduxjs/toolkit";
import recipeReducer from "../features/recipes/recipeSlice";
import sessionReducer from '../features/session/sessionSlice';

export const store = configureStore({
  reducer: {
    recipes: recipeReducer,
      session: sessionReducer,
  },
});

// Types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

