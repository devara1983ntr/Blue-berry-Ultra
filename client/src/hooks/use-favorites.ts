import { useState, useEffect, useCallback } from "react";

const FAVORITES_KEY = "blueberry_favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(FAVORITES_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.error("Failed to save favorites:", error);
    }
  }, [favorites]);

  const addFavorite = useCallback((videoId: string) => {
    setFavorites((prev) => {
      if (prev.includes(videoId)) return prev;
      return [...prev, videoId];
    });
  }, []);

  const removeFavorite = useCallback((videoId: string) => {
    setFavorites((prev) => prev.filter((id) => id !== videoId));
  }, []);

  const toggleFavorite = useCallback((videoId: string) => {
    setFavorites((prev) => {
      if (prev.includes(videoId)) {
        return prev.filter((id) => id !== videoId);
      }
      return [...prev, videoId];
    });
  }, []);

  const isFavorite = useCallback(
    (videoId: string) => favorites.includes(videoId),
    [favorites]
  );

  return {
    favorites,
    addFavorite,
    removeFavorite,
    toggleFavorite,
    isFavorite,
    count: favorites.length,
  };
}
