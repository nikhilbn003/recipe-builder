import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import type { RootState } from "../../app/store";
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Divider,
  Card,
  CardContent,
} from "@mui/material";

const CookingSession = () => {
  const { id } = useParams();
  const recipe = useSelector((s: RootState) =>
    s.recipes.list.find((r) => r.id === id)
  );

  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (recipe) {
      setProgress(((stepIndex + 1) / recipe.steps.length) * 100);
    }
  }, [stepIndex, recipe]);

  if (!recipe) return <Typography>Recipe not found</Typography>;

  const currentStep = recipe.steps[stepIndex];

  // Helper: Get ingredients linked to this step
  const stepIngredients =
    currentStep.type === "instruction"
      ? recipe.ingredients.filter((ing) =>
          currentStep.ingredientIds?.includes(ing.id)
        )
      : [];

  return (
    <Box sx={{ p: 3, pb: 12 /* bottom padding for mini-player */ }}>
      <Typography variant="h4" fontWeight="bold" gutterBottom>
        {recipe.title}
      </Typography>

      <Typography variant="subtitle1" color="text.secondary">
        Difficulty: {recipe.difficulty}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>
        Step {stepIndex + 1} of {recipe.steps.length}
      </Typography>

      <Card variant="outlined" sx={{ mb: 3, borderRadius: 2 }}>
        <CardContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {currentStep.description || "No description provided."}
          </Typography>

          {/* Instruction Step */}
          {currentStep.type === "instruction" && stepIngredients.length > 0 && (
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                🧂 Ingredients used:
              </Typography>
              {stepIngredients.map((ing) => (
                <Typography key={ing.id} variant="body2">
                  • {ing.name} — {ing.quantity} {ing.unit}
                </Typography>
              ))}
            </Box>
          )}

          {/* Cooking Step */}
          {currentStep.type === "cooking" && currentStep.cookingSettings && (
            <Box sx={{ ml: 2 }}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                🍳 Cooking Settings:
              </Typography>
              <Typography variant="body2">
                Temperature: {currentStep.cookingSettings.temperature}°C
              </Typography>
              <Typography variant="body2">
                Speed: {currentStep.cookingSettings.speed}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>

      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          height: 10,
          borderRadius: 5,
          mb: 3,
        }}
      />

      <Box sx={{ display: "flex", justifyContent: "space-between", gap: 2 }}>
        <Button
          variant="outlined"
          disabled={stepIndex === 0}
          onClick={() => setStepIndex((i) => Math.max(0, i - 1))}
        >
          Previous
        </Button>
        <Button
          variant="contained"
          disabled={stepIndex >= recipe.steps.length - 1}
          onClick={() => setStepIndex((i) => i + 1)}
        >
          Next Step
        </Button>
      </Box>

      {/* === Mini Player Fixed at Bottom === */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "100%",
          bgcolor: "#fff",
          borderTop: "1px solid #ddd",
          boxShadow: "0 -2px 10px rgba(0,0,0,0.05)",
          p: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          zIndex: 999,
        }}
      >
        <Box>
          <Typography variant="subtitle2">
            🎧 Step {stepIndex + 1}:{" "}
            {currentStep.description
              ? currentStep.description.slice(0, 40)
              : "Audio Guide"}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {recipe.title}
          </Typography>
        </Box>
        <Button
          variant="contained"
          size="small"
          onClick={() => setIsPlaying((p) => !p)}
        >
          {isPlaying ? "⏸ Pause" : "▶️ Play"}
        </Button>
      </Box>
    </Box>
  );
};

export default CookingSession;
