import React, { useState } from "react";
import { Search, Dice5 } from "lucide-react";

export default function SearchBar({ onSearch, onRandom }) {
  const [ingredients, setIngredients] = useState("");
  const [exclude, setExclude] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const ingredientsArr = ingredients
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const excludeArr = exclude
      .split(",")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    onSearch(ingredientsArr, excludeArr);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-10">
      <div className="bg-white/70 backdrop-blur-sm p-5 rounded-2xl shadow-lg space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-2.5 text-gray-400"
              size={20}
            />
            <input
              className="w-full pl-10 pr-3 py-2 rounded-xl border focus:ring-2 focus:ring-pink-400"
              placeholder="Ingredients (e.g. chicken, garlic)"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="px-5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-red-500 text-white font-medium hover:opacity-90 transition"
          >
            Search
          </button>
          <button
            type="button"
            onClick={onRandom}
            className="px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 flex items-center gap-1"
          >
            <Dice5 size={18} /> Random
          </button>
        </div>
        <input
          className="w-full p-2 rounded-xl border focus:ring-2 focus:ring-yellow-400"
          placeholder="Exclude ingredients (e.g. nuts, dairy)"
          value={exclude}
          onChange={(e) => setExclude(e.target.value)}
        />
      </div>
    </form>
  );
}
