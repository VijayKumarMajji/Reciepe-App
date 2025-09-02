export const loadFavorites = () => {
  try {
    const raw = localStorage.getItem("mealmatch:favorites");
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};
export const saveFavorites = (arr) => {
  try {
    localStorage.setItem("mealmatch:favorites", JSON.stringify(arr));
  } catch (e) {}
};
