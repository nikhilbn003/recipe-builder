export type SessionByRecipe = {
  currentStepIndex: number;       // 0-based index
  isRunning: boolean;             // session running or paused
  stepRemainingSec: number;       // seconds remaining in current step
  overallRemainingSec: number;    // total remaining for current + future steps
  lastTickTs?: number;            // timestamp of last tick for drift correction
  stepsDurationsSec: number[];    // precomputed durations of steps
};

export interface SessionState {
  activeRecipeId: string | null;           // only one active session at a time
  byRecipeId: Record<string, SessionByRecipe>;
}

