const BASE = "https://www.themealdb.com/api/json/v1/1";

export async function fetchFilterByIngredient(ingredient) {
  const url = `${BASE}/filter.php?i=${encodeURIComponent(ingredient)}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Network response was not ok");
  const data = await res.json();
  return data.meals || [];
}

// For multi-ingredient: call once per ingredient and intersect by idMeal
export async function fetchMealsByIngredients(ingredients = []) {
  if (!ingredients.length) return [];
  if (ingredients.length === 1) {
    return fetchFilterByIngredient(ingredients[0]);
  }
  // fetch all and intersect
  const results = await Promise.all(
    ingredients.map((i) => fetchFilterByIngredient(i))
  );
  // results is array of arrays, compute intersection by idMeal
  const idSets = results.map((list) => new Set(list.map((m) => m.idMeal)));
  const intersection = results[0].filter((m) =>
    idSets.every((s) => s.has(m.idMeal))
  );
  return intersection;
}

export async function fetchMealDetails(id) {
  const res = await fetch(`${BASE}/lookup.php?i=${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error("Network response was not ok");
  const data = await res.json();
  return (data.meals && data.meals[0]) || null;
}

export async function fetchSearchByName(name) {
  const res = await fetch(`${BASE}/search.php?s=${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error("Network response was not ok");
  const data = await res.json();
  return data.meals || [];
}

export async function fetchRandomMeal() {
  const res = await fetch(`${BASE}/random.php`);
  if (!res.ok) throw new Error("Network response was not ok");
  const data = await res.json();
  return (data.meals && data.meals[0]) || null;
}
