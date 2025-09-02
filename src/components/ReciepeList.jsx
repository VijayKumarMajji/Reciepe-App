import React from "react";
import RecipeCard from "./ReciepeCard";

export default function RecipeList({
  meals,
  onOpen,
  favorites,
  toggleFavorite,
}) {
  if (!meals || meals.length === 0) {
    return (
      <p className="text-center text-gray-600 mt-10">
        No recipes found. Try different ingredients.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {meals.map((m) => (
        <RecipeCard
          key={m.idMeal}
          meal={m}
          onOpen={onOpen}
          favorite={favorites.includes(m.idMeal)}
          toggleFavorite={toggleFavorite}
        />
      ))}
    </div>
  );
}
