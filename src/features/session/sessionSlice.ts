import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';


// Types for session state
type SessionByRecipe = {
  currentStepIndex: number; // 0-based
  isRunning: boolean;
  stepRemainingSec: number;
  overallRemainingSec: number;
  lastTickTs?: number;
};

// Redux slice state
interface SessionState {
  activeRecipeId: string | null;
  byRecipeId: Record<string, SessionByRecipe>;
}

const initialState: SessionState = {
  activeRecipeId: null,
  byRecipeId: {},
};

// Payload type for starting a session
type StartSessionPayload = {
  recipeId: string;
  totalDurationSec: number;
  steps: { durationMinutes: number }[];
};

// Payload type for ending a step
type EndStepPayload = {
  recipeId: string;
  totalSteps: number;
  nextStepDuration?: number;
};

// Create the slice
const sessionSlice = createSlice({
  name: 'session',
  initialState,
  reducers: {
    startSession: (state, action: PayloadAction<StartSessionPayload>) => {
      const { recipeId, totalDurationSec, steps } = action.payload;
      if (state.activeRecipeId) return; // only one session at a time

      state.activeRecipeId = recipeId;
      state.byRecipeId[recipeId] = {
        currentStepIndex: 0,
        isRunning: true,
        stepRemainingSec: steps[0].durationMinutes * 60,
        overallRemainingSec: totalDurationSec,
        lastTickTs: Date.now(),
      };
    },
    pauseResume: (state, action: PayloadAction<string>) => {
      const session = state.byRecipeId[action.payload];
      if (!session) return;
      session.isRunning = !session.isRunning;
      session.lastTickTs = Date.now();
    },
    tickSecond: (state, action: PayloadAction<{ recipeId: string }>) => {
  const session = state.byRecipeId[action.payload.recipeId];
  if (!session || !session.isRunning) return;

  const now = Date.now();
  const delta = Math.floor((now - (session.lastTickTs || now)) / 1000);
  if (delta <= 0) return;

  session.stepRemainingSec = Math.max(0, session.stepRemainingSec - delta);
  session.overallRemainingSec = Math.max(0, session.overallRemainingSec - delta);
  session.lastTickTs = now;
},
    endStep: (state, action: PayloadAction<EndStepPayload>) => {
      const session = state.byRecipeId[action.payload.recipeId];
      if (!session) return;

      if (session.currentStepIndex + 1 < action.payload.totalSteps) {
        session.currentStepIndex += 1;
        session.stepRemainingSec = action.payload.nextStepDuration || 0;
        session.lastTickTs = Date.now();
      } else {
        // End of recipe
        delete state.byRecipeId[action.payload.recipeId];
        state.activeRecipeId = null;
      }
    },
    stopSession: (state, action: PayloadAction<{ recipeId: string }>) => {
      const session = state.byRecipeId[action.payload.recipeId];
      if (!session) return;
      // stop current step only
      session.stepRemainingSec = 0;
    },
  },
});

export const { startSession, pauseResume, tickSecond, endStep, stopSession } =
  sessionSlice.actions;

export default sessionSlice.reducer;
