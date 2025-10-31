import { configureStore } from "@reduxjs/toolkit";
import recipeReducer from "../features/recipes/recipeSlice";

export const store = configureStore({
  reducer: {
    recipes: recipeReducer,
  },
});

// Types for RootState and AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;



