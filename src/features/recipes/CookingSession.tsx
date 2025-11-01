import React, { useEffect } from "react";
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  Chip,
  CircularProgress,
  Stack,
  Divider,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import {
  startSession,
  pauseResume,
  stopSession,
  tickSecond,
} from "../session/sessionSlice";

export default function CookingSession() {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();

  const recipe = useSelector((s: RootState) =>
    s.recipes.list.find((r) => r.id === id)
  );
  const session = useSelector((s: RootState) =>
    id ? s.session.byRecipeId[id] : undefined
  );

  // Global ticking
  useEffect(() => {
    if (!session?.isRunning) return;
    const interval = setInterval(() => {
      dispatch(tickSecond({ recipeId: id! }));
    }, 1000);
    return () => clearInterval(interval);
  }, [session?.isRunning, dispatch, id]);

  if (!recipe) return <Typography>Recipe not found</Typography>;

  const steps = recipe.steps || [];
  const currentIndex = session?.currentStepIndex ?? 0;
  const currentStep = steps[currentIndex];
  const totalDurationSec = steps.reduce(
    (sum, s) => sum + (s.durationMinutes || 0) * 60,
    0
  );

  const stepDurationSec = (currentStep?.durationMinutes || 0) * 60;
  const stepRemainingSec = session?.stepRemainingSec ?? stepDurationSec;
  const stepElapsedSec = Math.max(0, stepDurationSec - stepRemainingSec);
  const stepProgressPercent =
    stepDurationSec > 0
      ? Math.round((stepElapsedSec / stepDurationSec) * 100)
      : 0;

  const overallRemainingSec = session?.overallRemainingSec ?? totalDurationSec;
  const overallElapsedSec = totalDurationSec - overallRemainingSec;
  const overallProgressPercent =
    totalDurationSec > 0
      ? Math.round((overallElapsedSec / totalDurationSec) * 100)
      : 0;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, "0");
    const s = (sec % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Map ingredientIds to actual ingredients
  const stepIngredients =
    currentStep?.ingredientIds?.map((id) =>
      recipe.ingredients.find((ing) => ing.id === id)
    ).filter(Boolean) || [];

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      {/* Header */}
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">{recipe.title}</Typography>
        <Stack direction="row" spacing={1}>
          <Chip label={recipe.difficulty || "Medium"} color="info" />
          <Chip
            label={`Total: ${Math.round(totalDurationSec / 60)} min`}
            color="default"
          />
         <Chip
  label={recipe.isFavorite ? "★ Favorite" : "☆ Favorite"}
  color={recipe.isFavorite ? "warning" : "default"}
/>

        </Stack>
      </Stack>

      <Divider sx={{ my: 3 }} />

      {/* Active Step Panel */}
      {currentStep ? (
        <>
          <Typography variant="h6">
            Step {currentIndex + 1} of {steps.length}
          </Typography>
          <Typography sx={{ mt: 1 }}>{currentStep.description}</Typography>

          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              mt: 2,
              gap: 2,
            }}
          >
            <CircularProgress
              variant="determinate"
              value={stepProgressPercent}
              size={60}
            />
            <Typography>
              {formatTime(stepRemainingSec)} / {formatTime(stepDurationSec)}
            </Typography>
          </Box>

          {/* Context chips */}
          <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
            {currentStep.type === "cooking" && currentStep.cookingSettings && (
              <>
                <Chip
                  label={`🔥 ${currentStep.cookingSettings.temperature}°C`}
                  color="error"
                />
                <Chip
                  label={`⚙️ Speed: ${currentStep.cookingSettings.speed}`}
                  color="info"
                />
              </>
            )}
            {currentStep.type === "instruction" &&
              stepIngredients.map((ing) => (
                <Chip
                  key={ing!.id}
                  label={`${ing!.name} – ${ing!.quantity}${ing!.unit}`}
                  variant="outlined"
                />
              ))}
          </Stack>
        </>
      ) : (
        <Typography>No steps found.</Typography>
      )}

      {/* Buttons */}
      <Stack direction="row" spacing={2} sx={{ mt: 4 }}>
        {!session && (
          <Button
            variant="contained"
            color="primary"
            onClick={() =>
              dispatch(
                startSession({
                  recipeId: id!,
                  totalDurationSec,
                  steps: steps.map((s) => ({ durationMinutes: s.durationMinutes })),
                })
              )
            }
          >
            Start Session
          </Button>
        )}

        {session && (
          <>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => dispatch(pauseResume(id!))}
            >
              {session.isRunning ? "Pause" : "Resume"}
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={() => dispatch(stopSession({ recipeId: id! }))}
            >
              STOP
            </Button>
          </>
        )}
      </Stack>

      {/* Timeline */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6">Timeline</Typography>
        <Box sx={{ mt: 1 }}>
          {steps.map((s, i) => {
            const duration = `${s.durationMinutes || 0} min`;
            let status: "Completed" | "Current" | "Upcoming" = "Upcoming";
            if (i < currentIndex) status = "Completed";
            else if (i === currentIndex) status = "Current";

            return (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  py: 0.5,
                  opacity: status === "Upcoming" ? 0.5 : 1,
                }}
              >
                <Typography>
                  {i + 1}. {s.shortTitle || s.description?.slice(0, 20)}
                </Typography>
                <Typography>
                  {duration} — <b>{status}</b>
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Overall Progress */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Overall Remaining: {formatTime(overallRemainingSec)} (
          {overallProgressPercent}%)
        </Typography>
        <LinearProgress
          variant="determinate"
          value={overallProgressPercent}
          sx={{ height: 10, borderRadius: 2 }}
        />
      </Box>
    </Box>
  );
}
