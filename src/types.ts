
// export type Difficulty = 'Easy' | 'Medium' | 'Hard';

// export type Ingredient = {
//   id: string;
//   name: string;
//   quantity: number;
//   unit: string;
// };

// export type CookSettings = {
//   temperature: number;
//   speed: number;
// };

// export type RecipeStep = {
//   id: string;
//   description: string;
//   type: 'cooking' | 'instruction';
//   durationMinutes: number;
//   cookingSettings?: CookSettings;
//   ingredientIds?: string[];
// };

// export type Recipe = {
//   id: string;
//   title: string;
//   cuisine?: string;
//   difficulty: Difficulty;
//   ingredients: Ingredient[];
//   steps: RecipeStep[];
//   isFavorite?: boolean;
//   createdAt: string;
//   updatedAt: string;
// };


// src/types.ts
export interface Ingredient {
  id: string;
  name: string;
  quantity: number;
  unit: string;
}

export type Difficulty = "Easy" | "Medium" | "Hard";

export interface CookingSettings {
  temperature: number; // °C
  speed: number; // 1–5
}

export interface RecipeStep {
  id: string;
  description: string;
  type: "instruction" | "cooking";
  durationMinutes: number;
  ingredientIds?: string[];
  cookingSettings?: CookingSettings;
}

export interface Recipe {
  id: string;
  title: string;
  cuisine?: string;
  difficulty: Difficulty;
  ingredients: Ingredient[];
  steps: RecipeStep[]; // ✅ Use rich objects, not strings
  isFavorite?: boolean;
  createdAt: string;
  updatedAt: string;
}
