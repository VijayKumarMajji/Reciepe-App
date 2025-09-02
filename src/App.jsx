import React, { useEffect, useState } from "react";
import SearchBar from "./components/SearchBar";
import RecipeList from "./components/ReciepeList";
import RecipeModal from "./components/ReciepeModal";
import {
  fetchMealsByIngredients,
  fetchMealDetails,
  fetchRandomMeal,
} from "./services/api";
import { loadFavorites, saveFavorites } from "./utils/localstorage";

export default function App() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedMealId, setSelectedMealId] = useState(null);
  const [favorites, setFavorites] = useState(loadFavorites());

  useEffect(() => {
    saveFavorites(favorites);
  }, [favorites]);

  const toggleFavorite = (id) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleOpen = (id) => setSelectedMealId(id);
  const handleClose = () => setSelectedMealId(null);

  const handleSearch = async (ingredientsArr, excludeArr = []) => {
    setError(null);
    setMeals([]);
    setLoading(true);
    try {
      if (!ingredientsArr.length) {
        setError("Please provide at least one ingredient.");
        setLoading(false);
        return;
      }
      const results = await fetchMealsByIngredients(ingredientsArr);

      // Filter out excluded ingredients (check up to 25 results)
      let filtered = results || [];
      if (excludeArr.length && filtered.length) {
        const limited = filtered.slice(0, 25);
        const details = await Promise.all(
          limited.map((m) => fetchMealDetails(m.idMeal))
        );
        const toKeepIds = new Set();
        details.forEach((d) => {
          if (!d) return;
          const ings = [];
          for (let i = 1; i <= 20; i++) {
            const ing = (d[`strIngredient${i}`] || "").toLowerCase();
            if (ing) ings.push(ing);
          }
          const hasExcluded = excludeArr.some((exc) =>
            ings.some((i) => i.includes(exc))
          );
          if (!hasExcluded) toKeepIds.add(d.idMeal);
        });
        filtered = filtered.filter(
          (m) =>
            toKeepIds.has(m.idMeal) ||
            !limited.some((l) => l.idMeal === m.idMeal)
        );
      }

      setMeals(filtered);
    } catch (err) {
      setError("Failed to fetch recipes. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleRandom = async () => {
    setLoading(true);
    setError(null);
    try {
      const m = await fetchRandomMeal();
      if (m) setMeals([m]);
    } catch (e) {
      setError("Failed to fetch a random recipe.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 bg-clip-text text-transparent drop-shadow">
          Meal Match
        </h1>
        <p className="mt-2 text-gray-600">
          Find delicious recipes by ingredients 🍳
        </p>
      </header>

      <SearchBar onSearch={handleSearch} onRandom={handleRandom} />

      {loading && <p className="text-center text-gray-600">Loading...</p>}
      {error && <p className="text-center text-red-500">{error}</p>}

      <main>
        <RecipeList
          meals={meals}
          onOpen={handleOpen}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
        />
      </main>

      {selectedMealId && (
        <RecipeModal
          id={selectedMealId}
          onClose={handleClose}
          isOpen={!!selectedMealId}
          onToggleFavorite={() => toggleFavorite(selectedMealId)}
          isFavorite={favorites.includes(selectedMealId)}
        />
      )}

      <footer className="mt-12 text-sm text-gray-500 text-center">
        <p>
          Powered by{" "}
          <a
            href="https://www.themealdb.com"
            target="_blank"
            rel="noreferrer"
            className="underline hover:text-gray-700"
          >
            TheMealDB
          </a>
        </p>
      </footer>
    </div>
  );
}
