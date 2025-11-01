import { Routes, Route, Link } from "react-router-dom";
import RecipeForm from "./features/recipes/RecipeForm";
import RecipeList from "./features/recipes/RecipeList";
import CookingSession from "./features/recipes/CookingSession";
import MiniPlayer from "./components/MiniPlayer";
import { AppBar, Toolbar, Button } from "@mui/material";
import { useSelector } from "react-redux";
import type { RootState } from "./app/store"; // adjust path if needed

const App = () => {
  // Get recipes from Redux store
  const recipes = useSelector((state: RootState) => state.recipes.list);

  return (
    <>
      <AppBar position="static">
        <Toolbar>
          <Button color="inherit" component={Link} to="/">Recipes</Button>
          <Button color="inherit" component={Link} to="/create">Create</Button>
        </Toolbar>
      </AppBar>

      <Routes>
        <Route path="/" element={<RecipeList />} />
        <Route path="/create" element={<RecipeForm />} />
        <Route path="/cook/:id" element={<CookingSession />} />
        <Route path="*" element={<h2>404 - Not Found</h2>} />
      </Routes>

      <MiniPlayer recipes={recipes} />
    </>
  );
};

export default App;


