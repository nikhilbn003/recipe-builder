import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { SessionByRecipe, SessionState } from "../session/types";

// Payload types
type StartSessionPayload = {
  recipeId: string;
  totalDurationSec: number;
  steps: { durationMinutes: number }[];
};

type EndStepPayload = {
  recipeId: string;
  totalSteps: number;
  nextStepDuration?: number;
};


const initialState: SessionState = {
  activeRecipeId: null,
  byRecipeId: {},
};


const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    startSession: (state, action: PayloadAction<StartSessionPayload>) => {
      const { recipeId, totalDurationSec, steps } = action.payload;
      if (state.activeRecipeId) return; // only one session at a time

      const stepsDurationsSec = steps.map(
        (s) => (s.durationMinutes || 0) * 60
      );

      state.activeRecipeId = recipeId;
      state.byRecipeId[recipeId] = {
        currentStepIndex: 0,
        isRunning: true,
        stepRemainingSec: stepsDurationsSec[0] || 0,
        overallRemainingSec: totalDurationSec,
        lastTickTs: Date.now(),
        stepsDurationsSec, 
      };
    },

    pauseResume: (state, action: PayloadAction<string>) => {
      const session = state.byRecipeId[action.payload];
      if (!session) return;
      session.isRunning = !session.isRunning;
      session.lastTickTs = Date.now();
    },

    tickSecond: (state, action: PayloadAction<{ recipeId: string }>) => {
      const { recipeId } = action.payload;
      const session = state.byRecipeId[recipeId];
      if (!session || !session.isRunning) return;

      session.stepRemainingSec -= 1;
      session.overallRemainingSec -= 1;

      // ⏭ Move to next step if finished
      if (session.stepRemainingSec <= 0) {
        session.currentStepIndex += 1;

        const nextStepDuration =
          session.stepsDurationsSec[session.currentStepIndex];
        if (nextStepDuration) {
          session.stepRemainingSec = nextStepDuration;
        } else {
         
          session.isRunning = false;
          session.stepRemainingSec = 0;
          session.overallRemainingSec = 0;
          state.activeRecipeId = null;
        }
      }
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
     resetSession: (state, action: PayloadAction<{ recipeId: string }>) => {
      delete state.byRecipeId[action.payload.recipeId];
      if (state.activeRecipeId === action.payload.recipeId) {
        state.activeRecipeId = null;
      }
    },
    stopSession: (state, action: PayloadAction<{ recipeId: string }>) => {
      const session = state.byRecipeId[action.payload.recipeId];
      if (!session) return;
     
      delete state.byRecipeId[action.payload.recipeId];
      state.activeRecipeId = null;
    },
  },
});

// ✅ Export actions
export const {
  startSession,
  pauseResume,
  tickSecond,
  endStep,
  stopSession,
  resetSession,
} = sessionSlice.actions;

// ✅ Export reducer
export default sessionSlice.reducer;
