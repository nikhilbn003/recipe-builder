import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store"; // ⬅ type-only import
import { useParams } from "react-router-dom";
import { Box, Button, Typography, LinearProgress } from "@mui/material";

const CookingSession = () => {
  const { id } = useParams();
  const recipe = useSelector((s: RootState) =>
    s.recipes.list.find(r => r.id === id)
  );
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setProgress(((stepIndex + 1) / (recipe?.steps.length || 1)) * 100);
  }, [stepIndex, recipe]);

  if (!recipe) return <Typography>Recipe not found</Typography>;

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5">{recipe.title}</Typography>
      <Typography sx={{ mt: 2 }}>Step {stepIndex + 1}: {recipe.steps[stepIndex]}</Typography>
      <LinearProgress variant="determinate" value={progress} sx={{ mt: 2 }} />
      <Button
        variant="contained"
        sx={{ mt: 2 }}
        disabled={stepIndex >= recipe.steps.length - 1}
        onClick={() => setStepIndex(stepIndex + 1)}
      >
        Next Step
      </Button>
    </Box>
  );
};

export default CookingSession;
