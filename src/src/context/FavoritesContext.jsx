import { useEffect, useMemo, useState } from "react";
import { FavoritesContext } from "./favoritesContextObject";

export function FavoritesProvider({ children }) {
  const [favorites, setFavorites] = useState(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem("nihonya-favorites")) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("nihonya-favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (product) => {
    setFavorites((current) => {
      const exists = current.some((item) => item.id === product.id);
      if (exists) {
        return current.filter((item) => item.id !== product.id);
      }
      return [...current, product];
    });
  };

  const favoriteIds = useMemo(
    () => new Set(favorites.map((item) => item.id)),
    [favorites]
  );

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, favoriteIds }}
    >
      {children}
    </FavoritesContext.Provider>
  );
}

