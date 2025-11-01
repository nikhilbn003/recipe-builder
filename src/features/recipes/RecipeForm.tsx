import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { useDispatch } from 'react-redux';
import { addRecipe } from '../recipes/recipeSlice';
import type { Recipe, Ingredient, RecipeStep } from '@/types';

export default function RecipeForm() {
  const dispatch = useDispatch();

  const [recipe, setRecipe] = useState<Recipe>({
    id: uuid(),
    title: '',
    difficulty: 'Easy',
    ingredients: [],
    steps: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  const [message, setMessage] = useState<string | null>(null);

  const addIngredient = () => {
    setRecipe({
      ...recipe,
      ingredients: [
        ...recipe.ingredients,
        { id: uuid(), name: '', quantity: 0, unit: '' },
      ],
    });
  };

  const addStep = () => {
    setRecipe({
      ...recipe,
      steps: [
        ...recipe.steps,
        {
          id: uuid(),
          description: '',
          type: 'instruction',
          durationMinutes: 1,
          ingredientIds: [],
        },
      ],
    });
  };

  const validateRecipe = (): string | null => {
    if (!recipe.title.trim()) return '❌ Recipe title is required.';
    if (recipe.title.trim().length < 3)
      return '❌ Recipe title must be at least 3 characters.';
    if (recipe.ingredients.length < 1)
      return '❌ Please add at least one ingredient.';
    if (recipe.steps.length < 1)
      return '❌ Please add at least one step.';
    for (const step of recipe.steps) {
      if (step.durationMinutes <= 0)
        return '❌ Each step must have a duration greater than 0.';
      if (step.type === 'cooking') {
        if (!step.cookingSettings)
          return '❌ Cooking steps must include temperature and speed.';
        const { temperature, speed } = step.cookingSettings;
        if (temperature < 40 || temperature > 200)
          return '❌ Temperature must be between 40 and 200°C.';
        if (speed < 1 || speed > 5)
          return '❌ Speed must be between 1 and 5.';
      }
      if (step.type === 'instruction') {
        if (!step.ingredientIds?.length)
          return '❌ Instruction steps must reference at least one ingredient.';
      }
    }
    return null;
  };

  const handleSubmit = () => {
    const error = validateRecipe();
    if (error) {
      setMessage(error);
      return;
    }

    const formattedRecipe: Recipe = {
      ...recipe,
      updatedAt: new Date().toISOString(),
    };

    dispatch(addRecipe(formattedRecipe));
    setMessage('✅ Recipe saved successfully!');
    console.log('✅ Recipe saved:', recipe);

    // Reset form
    setRecipe({
      id: uuid(),
      title: '',
      difficulty: 'Easy',
      ingredients: [],
      steps: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>🍳 Create a New Recipe</h2>

      <div style={styles.formGroup}>
        <label style={styles.label}>Recipe Title</label>
        <input
          type="text"
          placeholder="e.g., Chocolate Cake"
          value={recipe.title}
          onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
          style={styles.input}
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Difficulty</label>
        <select
          value={recipe.difficulty}
          onChange={(e) =>
            setRecipe({
              ...recipe,
              difficulty: e.target.value as Recipe['difficulty'],
            })
          }
          style={styles.select}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
      </div>

      <h3 style={styles.subheading}>🥕 Ingredients</h3>
      {recipe.ingredients.map((ing) => (
        <div key={ing.id} style={styles.ingredientRow}>
          <label style={styles.inlineLabel}>Name</label>
          <input
            placeholder="e.g., Sugar"
            value={ing.name}
            onChange={(e) =>
              setRecipe({
                ...recipe,
                ingredients: recipe.ingredients.map((x) =>
                  x.id === ing.id ? { ...x, name: e.target.value } : x
                ),
              })
            }
            style={styles.smallInput}
          />
          <label style={styles.inlineLabel}>Qty</label>
          <input
            type="number"
            placeholder="e.g., 100"
            value={ing.quantity}
            onChange={(e) =>
              setRecipe({
                ...recipe,
                ingredients: recipe.ingredients.map((x) =>
                  x.id === ing.id
                    ? { ...x, quantity: Number(e.target.value) }
                    : x
                ),
              })
            }
            style={styles.smallInput}
          />
          <label style={styles.inlineLabel}>Unit</label>
          <input
            placeholder="g / ml / pcs"
            value={ing.unit}
            onChange={(e) =>
              setRecipe({
                ...recipe,
                ingredients: recipe.ingredients.map((x) =>
                  x.id === ing.id ? { ...x, unit: e.target.value } : x
                ),
              })
            }
            style={styles.smallInput}
          />
        </div>
      ))}
      <button onClick={addIngredient} style={styles.button}>
        ➕ Add Ingredient
      </button>

      <h3 style={styles.subheading}>📝 Steps</h3>
      {recipe.steps.map((step) => (
        <div key={step.id} style={styles.stepBlock}>
          <label style={styles.label}>Step Description</label>
          <textarea
            placeholder="Describe the step..."
            value={step.description}
            onChange={(e) =>
              setRecipe({
                ...recipe,
                steps: recipe.steps.map((s) =>
                  s.id === step.id ? { ...s, description: e.target.value } : s
                ),
              })
            }
            style={styles.textarea}
          />

          <label style={styles.label}>Step Type</label>
          <select
            value={step.type}
            onChange={(e) =>
              setRecipe({
                ...recipe,
                steps: recipe.steps.map((s) =>
                  s.id === step.id
                    ? { ...s, type: e.target.value as RecipeStep['type'] }
                    : s
                ),
              })
            }
            style={styles.select}
          >
            <option value="instruction">Instruction</option>
            <option value="cooking">Cooking</option>
          </select>

          <label style={styles.label}>Duration (minutes)</label>
          <input
            type="number"
            placeholder="e.g., 5"
            value={step.durationMinutes}
            onChange={(e) =>
              setRecipe({
                ...recipe,
                steps: recipe.steps.map((s) =>
                  s.id === step.id
                    ? { ...s, durationMinutes: Number(e.target.value) }
                    : s
                ),
              })
            }
            style={styles.input}
          />

          {step.type === 'instruction' && (
            <div>
              <label style={styles.label}>Select Ingredients Used</label>
              {recipe.ingredients.map((ing) => (
                <label key={ing.id} style={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={step.ingredientIds?.includes(ing.id) || false}
                    onChange={(e) => {
                      const updatedIds = e.target.checked
                        ? [...(step.ingredientIds || []), ing.id]
                        : (step.ingredientIds || []).filter(
                            (id) => id !== ing.id
                          );

                      setRecipe({
                        ...recipe,
                        steps: recipe.steps.map((s) =>
                          s.id === step.id
                            ? { ...s, ingredientIds: updatedIds }
                            : s
                        ),
                      });
                    }}
                  />
                  {ing.name || '(Unnamed Ingredient)'}
                </label>
              ))}
            </div>
          )}

          {step.type === 'cooking' && (
            <div>
              <label style={styles.label}>Temperature (°C)</label>
              <input
                type="number"
                placeholder="e.g., 180"
                value={step.cookingSettings?.temperature ?? ''}
                onChange={(e) =>
                  setRecipe({
                    ...recipe,
                    steps: recipe.steps.map((s) =>
                      s.id === step.id
                        ? {
                            ...s,
                            cookingSettings: {
                              ...s.cookingSettings,
                              temperature: Number(e.target.value),
                              speed: s.cookingSettings?.speed ?? 1,
                            },
                          }
                        : s
                    ),
                  })
                }
                style={styles.smallInput}
              />

              <label style={styles.label}>Speed</label>
              <input
                type="number"
                placeholder="e.g., 2"
                value={step.cookingSettings?.speed ?? ''}
                onChange={(e) =>
                  setRecipe({
                    ...recipe,
                    steps: recipe.steps.map((s) =>
                      s.id === step.id
                        ? {
                            ...s,
                            cookingSettings: {
                              ...s.cookingSettings,
                              speed: Number(e.target.value),
                              temperature:
                                s.cookingSettings?.temperature ?? 40,
                            },
                          }
                        : s
                    ),
                  })
                }
                style={styles.smallInput}
              />
            </div>
          )}
        </div>
      ))}

      <button onClick={addStep} style={styles.button}>
        ➕ Add Step
      </button>

      <hr style={{ margin: '20px 0' }} />

      <button onClick={handleSubmit} style={styles.saveButton}>
        💾 Save Recipe
      </button>

      {message && (
        <p
          style={{
            marginTop: '10px',
            color: message.startsWith('✅') ? 'green' : 'red',
            fontWeight: 500,
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    padding: '20px',
    maxWidth: 600,
    margin: '0 auto',
    background: '#fafafa',
    borderRadius: 8,
  },
  heading: { textAlign: 'center', marginBottom: 20 },
  subheading: { marginTop: 20 },
  formGroup: { marginBottom: 15 },
  label: { display: 'block', fontWeight: 500, marginBottom: 4 },
  inlineLabel: { marginLeft: 8 },
  input: {
    width: '100%',
    padding: '6px',
    borderRadius: 4,
    border: '1px solid #ccc',
  },
  select: {
    width: '100%',
    padding: '6px',
    borderRadius: 4,
    border: '1px solid #ccc',
  },
  textarea: {
    width: '100%',
    height: 60,
    padding: 6,
    borderRadius: 4,
    border: '1px solid #ccc',
  },
  smallInput: {
    width: 100,
    marginRight: 8,
    padding: '4px',
    borderRadius: 4,
    border: '1px solid #ccc',
  },
  ingredientRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    marginBottom: 8,
  },
  stepBlock: {
    padding: 10,
    marginBottom: 15,
    background: '#fff',
    borderRadius: 6,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  },
  button: {
    padding: '6px 10px',
    background: '#ddd',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    marginTop: 6,
  },
  saveButton: {
    width: '100%',
    padding: '10px',
    background: '#000',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
    fontWeight: 600,
  },
  checkboxLabel: {
    display: 'block',
    marginLeft: 10,
  },
};
