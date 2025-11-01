import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Typography,
  Paper,
  Chip,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  deleteRecipe,
  setCurrentCooking,
  toggleFavorite,
} from "./recipeSlice";
import { useAppSelector, useAppDispatch } from "../../app/hooks";

const RecipeList: React.FC = () => {
  const recipes = useAppSelector((state) => state.recipes.list);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // store IDs for which buttons are hidden
  const [hiddenButtons, setHiddenButtons] = useState<string[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState<string>("All");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const handleStartCooking = (id: string) => {
    setHiddenButtons((prev) => [...prev, id]);
    dispatch(setCurrentCooking(id));
    navigate(`/cook/${id}`);
  };

  // Filter recipes by difficulty
  let filteredRecipes = recipes.filter((r) =>
    difficultyFilter === "All" ? true : r.difficulty === difficultyFilter
  );

  // Sort recipes by total time
  filteredRecipes = filteredRecipes.sort((a, b) => {
    const aTime = a.steps.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
    const bTime = b.steps.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
    return sortOrder === "asc" ? aTime - bTime : bTime - aTime;
  });

  return (
    <Box sx={{ p: 2 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h5">Saved Recipes</Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/create")}
        >
          Create Recipe
        </Button>
      </Stack>

      {/* Filters */}
      <Stack direction="row" spacing={2} sx={{ mt: 2, mb: 2 }}>
        <FormControl size="small" sx={{ width: 120 }}>
          <InputLabel>Difficulty</InputLabel>
          <Select
            value={difficultyFilter}
            label="Difficulty"
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Easy">Easy</MenuItem>
            <MenuItem value="Medium">Medium</MenuItem>
            <MenuItem value="Hard">Hard</MenuItem>
          </Select>
        </FormControl>

        <FormControl size="small" sx={{ width: 140 }}>
          <InputLabel>Sort by Time</InputLabel>
          <Select
            value={sortOrder}
            label="Sort by Time"
            onChange={(e) =>
              setSortOrder(e.target.value as "asc" | "desc")
            }
          >
            <MenuItem value="asc">Ascending</MenuItem>
            <MenuItem value="desc">Descending</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      {filteredRecipes.length === 0 ? (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography variant="body1" sx={{ mb: 2 }}>
            No recipes found.
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/create-recipe")}
          >
            Create Recipe
          </Button>
        </Box>
      ) : (
        filteredRecipes.map((r) => {
          const isHidden = hiddenButtons.includes(r.id);

          return (
            <Paper key={r.id} sx={{ p: 2, mt: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6">{r.title}</Typography>

                <Chip
                  label={r.isFavorite ? "★ Favorite" : "☆ Favorite"}
                  color={r.isFavorite ? "warning" : "default"}
                  clickable
                  onClick={() => dispatch(toggleFavorite(r.id))}
                />
              </Stack>

              <Typography variant="body2" sx={{ mt: 1 }}>
                Difficulty: {r.difficulty || "Medium"} | Total Time:{" "}
                {r.steps.reduce((sum, s) => sum + (s.durationMinutes || 0), 0)}{" "}
                min
              </Typography>

              {!isHidden && (
                <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                  <Button
                    variant="contained"
                    onClick={() => handleStartCooking(r.id)}
                  >
                    Start Cooking
                  </Button>
                  <Button
                    color="error"
                    onClick={() => dispatch(deleteRecipe(r.id))}
                  >
                    Delete
                  </Button>
                </Stack>
              )}
            </Paper>
          );
        })
      )}
    </Box>
  );
};

export default RecipeList;
