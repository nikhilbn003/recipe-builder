import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Recipe {
  id: string;
  title: string;
  steps: string[];
}

interface RecipeState {
  list: Recipe[];
  currentCookingId: string | null;
}

const initialState: RecipeState = {
  list: JSON.parse(localStorage.getItem('recipes') || '[]'),
  currentCookingId: null,
};

const recipeSlice = createSlice({
  name: 'recipes',
  initialState,
  reducers: {
    addRecipe(state, action: PayloadAction<Recipe>) {
      state.list.push(action.payload);
      localStorage.setItem('recipes', JSON.stringify(state.list));
    },
    deleteRecipe(state, action: PayloadAction<string>) {
      state.list = state.list.filter(r => r.id !== action.payload);
      localStorage.setItem('recipes', JSON.stringify(state.list));
    },
    setCurrentCooking(state, action: PayloadAction<string | null>) {
      state.currentCookingId = action.payload;
    },
  },
});

export const { addRecipe, deleteRecipe, setCurrentCooking } = recipeSlice.actions;
export default recipeSlice.reducer;

