import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import type { Recipe } from "../../types";

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
    toggleFavorite(state, action: PayloadAction<string>) {
      const recipe = state.list.find(r => r.id === action.payload);
      if (recipe) {
        recipe.isFavorite = !recipe.isFavorite;
        localStorage.setItem('recipes', JSON.stringify(state.list));
      }
    },
  },
});

export const { addRecipe, deleteRecipe, setCurrentCooking, toggleFavorite } = recipeSlice.actions;
export default recipeSlice.reducer;
