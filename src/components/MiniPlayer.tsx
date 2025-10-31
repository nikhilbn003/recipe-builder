import { useDispatch, useSelector } from 'react-redux';
import { pauseResume, stopSession } from '../features/session/sessionSlice';
import { useNavigate, useLocation } from 'react-router-dom';
import type { RootState } from '../app/store';
import type { Recipe } from '@/types';

interface MiniPlayerProps {
  recipes: Recipe[];
}

export default function MiniPlayer({ recipes }: MiniPlayerProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { activeRecipeId, byRecipeId } = useSelector((state: RootState) => state.session);

  if (!activeRecipeId) return null;
  if (location.pathname === `/cook/${activeRecipeId}`) return null;

  const session = byRecipeId[activeRecipeId];
  const recipe = recipes.find(r => r.id === activeRecipeId);
  if (!session || !recipe) return null;

  const step = recipe.steps[session.currentStepIndex];
  if (!step) return null;

  const stepDurationSec = (step.durationMinutes || 0) * 60;
  const stepElapsedSec = Math.max(0, stepDurationSec - session.stepRemainingSec);
  const stepProgressPercent = stepDurationSec > 0 ? Math.round((stepElapsedSec / stepDurationSec) * 100) : 0;

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 10,
        right: 10,
        width: 280,
        padding: 10,
        border: '1px solid #ccc',
        borderRadius: 8,
        backgroundColor: '#fff',
        boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
        cursor: 'pointer',
        zIndex: 999,
      }}
      onClick={() => navigate(`/cook/${activeRecipeId}`)}
    >
      <div style={{ fontWeight: 600, marginBottom: 4 }}>{recipe.title}</div>
      <div style={{ fontSize: 12, marginBottom: 4 }}>
        Step {session.currentStepIndex + 1} of {recipe.steps.length} · {formatTime(session.stepRemainingSec)}
      </div>

      <div style={{ height: 8, background: '#eee', borderRadius: 4, marginBottom: 4 }}>
        <div
          style={{
            width: `${stepProgressPercent}%`,
            height: '100%',
            background: 'green',
            borderRadius: 4,
            transition: 'width 0.2s linear',
          }}
        />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(pauseResume(activeRecipeId));
          }}
        >
          {session.isRunning ? 'Pause' : 'Resume'}
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            dispatch(stopSession({ recipeId: activeRecipeId }));
          }}
        >
          STOP
        </button>
      </div>
    </div>
  );
}
