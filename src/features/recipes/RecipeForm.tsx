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
    if (!recipe.title.trim()) return 'Recipe title is required.';
    if (recipe.title.trim().length < 3)
      return 'Recipe title must be at least 3 characters.';
    if (recipe.ingredients.length < 1)
      return 'At least one ingredient is required.';
    if (recipe.steps.length < 1) return 'At least one step is required.';

    for (const step of recipe.steps) {
      if (step.durationMinutes <= 0)
        return 'Each step must have a duration greater than 0.';

      if (step.type === 'cooking') {
        if (!step.cookingSettings)
          return 'Cooking steps must include temperature and speed.';
        const { temperature, speed } = step.cookingSettings;
        if (temperature < 40 || temperature > 200)
          return 'Temperature must be between 40 and 200°C.';
        if (speed < 1 || speed > 5)
          return 'Speed must be between 1 and 5.';
      }

      if (step.type === 'instruction') {
        if (!step.ingredientIds?.length)
          return 'Instruction steps must reference at least one ingredient.';
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

    const formattedRecipe = {
      ...recipe,
      steps: recipe.steps.map((s) => s.description || ''),
    };

    dispatch(addRecipe(formattedRecipe));
    setMessage('✅ Recipe saved successfully!');
    console.log('✅ Recipe saved:', recipe);

    // reset form
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
    <div style={{ padding: 20 }}>
      <h2>Create Recipe</h2>

      <input
        type="text"
        placeholder="Recipe Title"
        value={recipe.title}
        onChange={(e) => setRecipe({ ...recipe, title: e.target.value })}
      />

      <select
        value={recipe.difficulty}
        onChange={(e) =>
          setRecipe({
            ...recipe,
            difficulty: e.target.value as Recipe['difficulty'],
          })
        }
      >
        <option value="Easy">Easy</option>
        <option value="Medium">Medium</option>
        <option value="Hard">Hard</option>
      </select>

      <h3>Ingredients</h3>
      {recipe.ingredients.map((ing) => (
        <div key={ing.id}>
          <input
            placeholder="Name"
            value={ing.name}
            onChange={(e) =>
              setRecipe({
                ...recipe,
                ingredients: recipe.ingredients.map((x) =>
                  x.id === ing.id ? { ...x, name: e.target.value } : x
                ),
              })
            }
          />
          <input
            type="number"
            placeholder="Qty"
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
          />
          <input
            placeholder="Unit"
            value={ing.unit}
            onChange={(e) =>
              setRecipe({
                ...recipe,
                ingredients: recipe.ingredients.map((x) =>
                  x.id === ing.id ? { ...x, unit: e.target.value } : x
                ),
              })
            }
          />
        </div>
      ))}
      <button onClick={addIngredient}>Add Ingredient</button>

      <h3>Steps</h3>
      {recipe.steps.map((step) => (
        <div key={step.id}>
          <textarea
            placeholder="Description"
            value={step.description}
            onChange={(e) =>
              setRecipe({
                ...recipe,
                steps: recipe.steps.map((s) =>
                  s.id === step.id ? { ...s, description: e.target.value } : s
                ),
              })
            }
          />

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
          >
            <option value="instruction">Instruction</option>
            <option value="cooking">Cooking</option>
          </select>

          <input
            type="number"
            placeholder="Duration (minutes)"
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
          />

          {/* ✅ Ingredient selector for instruction steps */}
          {step.type === 'instruction' && (
            <div style={{ marginTop: 10 }}>
              <label>Select ingredients used:</label>
              {recipe.ingredients.map((ing) => (
                <label key={ing.id} style={{ display: 'block' }}>
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

          {/* ✅ Cooking settings for cooking steps */}
          {step.type === 'cooking' && (
            <div style={{ marginTop: 10 }}>
              <input
                type="number"
                placeholder="Temperature (°C)"
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
              />
              <input
                type="number"
                placeholder="Speed"
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
              />
            </div>
          )}
        </div>
      ))}

      <button onClick={addStep}>Add Step</button>

      <hr />
      <button onClick={handleSubmit}>Save Recipe</button>

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
