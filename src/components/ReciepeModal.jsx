import React, { useEffect, useState } from "react";
import { fetchMealDetails } from "../services/api";
import { motion } from "framer-motion";

function extractIngredients(meal) {
  const items = [];
  for (let i = 1; i <= 20; i++) {
    const ing = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ing && ing.trim())
      items.push({ ingredient: ing.trim(), measure: measure?.trim() || "" });
  }
  return items;
}

export default function RecipeModal({
  id,
  onClose,
  isOpen,
  onToggleFavorite,
  isFavorite,
}) {
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    let mounted = true;
    setLoading(true);
    fetchMealDetails(id)
      .then((m) => {
        if (!mounted) return;
        setMeal(m);
      })
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [id, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl shadow-xl w-full max-w-3xl overflow-y-auto max-h-[90vh]"
      >
        <div className="sticky top-0 bg-white p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-bold">{meal?.strMeal ?? "Recipe"}</h2>
          <div className="flex gap-3">
            <button onClick={onToggleFavorite}>
              {isFavorite ? "❤️" : "🤍"}
            </button>
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-black font-bold"
            >
              ✖
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {loading && <p>Loading...</p>}
          {meal && (
            <>
              <img
                className="rounded-lg w-full max-h-64 object-cover"
                src={meal.strMealThumb}
                alt={meal.strMeal}
              />

              <div className="flex flex-wrap gap-2">
                {extractIngredients(meal).map((it, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-pink-100 rounded-full text-sm"
                  >
                    {it.ingredient} {it.measure}
                  </span>
                ))}
              </div>

              <h3 className="font-semibold text-lg">Instructions</h3>
              <p className="whitespace-pre-line leading-relaxed">
                {meal.strInstructions}
              </p>

              {meal.strYoutube && (
                <a
                  href={meal.strYoutube}
                  target="_blank"
                  rel="noreferrer"
                  className="block mt-3 text-blue-600 hover:underline"
                >
                  ▶ Watch on YouTube
                </a>
              )}
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
