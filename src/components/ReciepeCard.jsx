import React from "react";
import { motion } from "framer-motion";

export default function RecipeCard({ meal, onOpen, favorite, toggleFavorite }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      className="relative rounded-2xl overflow-hidden shadow-md group cursor-pointer"
      onClick={() => onOpen(meal.idMeal)}
    >
      <img
        src={meal.strMealThumb}
        alt={meal.strMeal}
        className="w-full h-52 object-cover group-hover:brightness-75 transition"
      />
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-3">
        <h3 className="text-white font-semibold text-lg">{meal.strMeal}</h3>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          toggleFavorite(meal.idMeal);
        }}
        className="absolute top-3 right-3 text-2xl"
      >
        {favorite ? "❤️" : "🤍"}
      </button>
    </motion.div>
  );
}
