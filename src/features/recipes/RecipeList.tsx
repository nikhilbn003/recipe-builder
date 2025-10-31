import React from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button, Typography, Paper } from "@mui/material";
import { deleteRecipe, setCurrentCooking } from "./recipeSlice";
import { useAppSelector, useAppDispatch } from "../../app/hooks"; // typed hooks

const RecipeList: React.FC = () => {
  const recipes = useAppSelector((state) => state.recipes.list); // RootState typed now
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5">Saved Recipes</Typography>
      {recipes.map((r) => (
        <Paper key={r.id} sx={{ p: 2, mt: 2 }}>
          <Typography variant="h6">{r.title}</Typography>
          <Button
            variant="contained"
            sx={{ mr: 1 }}
            onClick={() => {
              dispatch(setCurrentCooking(r.id));
              navigate(`/cook/${r.id}`);
            }}
          >
            Start Cooking
          </Button>
          <Button color="error" onClick={() => dispatch(deleteRecipe(r.id))}>
            Delete
          </Button>
        </Paper>
      ))}
    </Box>
  );
};

export default RecipeList;
